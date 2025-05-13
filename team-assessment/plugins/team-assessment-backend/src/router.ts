import { HttpAuthService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { z } from 'zod';
import express from 'express';
import Router from 'express-promise-router';
import { TeamAssessmentListService } from './services/TodoListService/createAssessmentListService/types';
import prisma from './prismaClient'

export async function createRouter({
  httpAuth,
  teamAssessmentListService,
}: {
  httpAuth: HttpAuthService;
  teamAssessmentListService: TeamAssessmentListService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  // TEMPLATE NOTE:
  // Zod is a powerful library for data validation and recommended in particular
  // for user-defined schemas. In this case we use it for input validation too.
  //
  // If you want to define a schema for your API we recommend using Backstage's
  // OpenAPI tooling: https://backstage.io/docs/next/openapi/01-getting-started

  router.post('/createAssessment', async (req, res) => {
    const { targetUser, teamId } = req.body;

    const result = await teamAssessmentListService.createAssessment(
      {
        credentials: await httpAuth.credentials(req, { allow: ['user'] }),
      },
      String(targetUser),
      String(teamId)
    );

    res.status(201).json(result);
  });

  router.post('/setHardSkillMark', async (req, res) => {
    const { assessmentId, questionId, markId } = req.body;

    const result = await teamAssessmentListService.upsertHardSkill(
      { credentials: await httpAuth.credentials(req, { allow: ['user'] }) },
      Number(assessmentId),
      Number(questionId),
      Number(markId),
    );

    res.status(201).json(result);
  });

  router.get('/hardSkillSections', async (req, res) => {
    const sections = await teamAssessmentListService.getHardSkillSections(
      { credentials: await httpAuth.credentials(req, { allow: ['user'] }) },
    );
    res.status(200).json(sections);
  });

  router.get('/hardSkillMarks', async (req, res) => {
    const marks = await teamAssessmentListService.getHardSkillMarks(
      { credentials: await httpAuth.credentials(req, { allow: ['user'] }) },
    );
    res.status(200).json(marks);
  });

  router.post('/addComment', async (req, res) => {
    const { key, markId, commentText } = req.body;

    const result = await teamAssessmentListService.addComment(
      {
        credentials: await httpAuth.credentials(req, { allow: ['user'] }),
      },
      Number(key),
      Number(markId),
      String(commentText)
    );
    res.status(201).json(result);
  });

  router.get('/getAssessments', async (req, res) => {

    const { teamId } = req.query;

    res.json(
      await teamAssessmentListService.getAssessments({
        credentials: await httpAuth.credentials(req, { allow: ['user'] })
      },
        String(teamId)
      ));
  });

  router.get('/getSampleText', async (req, res) => {
    res.json(
      await teamAssessmentListService.getSampleText({
        credentials: await httpAuth.credentials(req, { allow: ['user'] }),
      }),
    );
  });

  return router;
}
