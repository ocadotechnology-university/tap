/* plugins/team-assessment-backend/src/router.ts */
import { HttpAuthService } from '@backstage/backend-plugin-api';
import express from 'express';
import Router from 'express-promise-router';
import { TeamAssessmentListService } from './services/TodoListService/createAssessmentListService/types';
import prisma from './prismaClient';

export async function createRouter({
  httpAuth,
  teamAssessmentListService,
}: {
  httpAuth: HttpAuthService;
  teamAssessmentListService: TeamAssessmentListService;
}): Promise<express.Router> {
  const router = Router();
  router.use(express.json());

  router.get('/getAssessments', async (req, res) => {
    const { teamId } = req.query;

    const data = await teamAssessmentListService.getAssessments(
      { credentials: await httpAuth.credentials(req, { allow: ['user'] }) },
      String(teamId),
    );

    res.status(200).json(data);
  });

  router.post('/createAssessment', async (req, res) => {
    const { targetUser, teamId } = req.body;
    const result = await teamAssessmentListService.createAssessment(
      { credentials: await httpAuth.credentials(req, { allow: ['user'] }) },
      String(targetUser),
      String(teamId),
    );
    res.status(201).json(result);
  });

  router.get('/softSkillComments', async (req, res) => {
    const { assessmentId } = req.query;

    const data = await teamAssessmentListService.getSoftSkillComments(
      { credentials: await httpAuth.credentials(req, { allow: ['user'] }) },
      Number(assessmentId),
    );
    res.status(200).json(data);
  });

  router.post('/upsertSoftSkillComment', async (req, res) => {
    const { assessmentId, areaId, competencyId, markId, commentId, commentText } = req.body;

    const result = await teamAssessmentListService.upsertSoftSkillComment(
      { credentials: await httpAuth.credentials(req, { allow: ['user'] }) },
      Number(assessmentId),
      Number(areaId),
      Number(competencyId),
      Number(markId),
      commentId ? Number(commentId) : null,
      String(commentText),
    );

    res.status(201).json(result);
  });

  router.get('/softSkillComment', async (req, res) => {
    const { assessmentId, areaId, competencyId, markId } = req.query;

    const result = await teamAssessmentListService.getSoftSkillComment(
      { credentials: await httpAuth.credentials(req, { allow: ['user'] }) },
      Number(assessmentId),
      Number(areaId),
      Number(competencyId),
      Number(markId),
    );

    res.status(200).json(result);
  });

  router.delete('/comment/:id', async (req, res) => {
    const id = Number(req.params.id);
    await prisma.comment.delete({ where: { id } });
    res.status(204).send();
  });

  router.get('/softSkillAreas', async (req, res) =>
    res.json(
      await teamAssessmentListService.getSoftSkillAreas({
        credentials: await httpAuth.credentials(req, { allow: ['user'] }),
      }),
    ),
  );

  router.get('/softSkillMarks', async (req, res) =>
    res.json(
      await teamAssessmentListService.getSoftSkillMarks({
        credentials: await httpAuth.credentials(req, { allow: ['user'] }),
      }),
    ),
  );

  router.get('/softSkillCompetencies', async (req, res) =>
    res.json(
      await teamAssessmentListService.getSoftSkillCompetencies({
        credentials: await httpAuth.credentials(req, { allow: ['user'] }),
      }),
    ),
  );

  return router;
}