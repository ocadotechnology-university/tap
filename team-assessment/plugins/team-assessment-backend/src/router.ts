import { HttpAuthService } from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { z } from 'zod';
import express from 'express';
import Router from 'express-promise-router';
import { TeamAssessmentListService } from './services/TodoListService/createAssessmentListService/types';

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

  // router.post('/createAssessment', async (req, res) => {

  //   const result = await teamAssessmentListService.createAssessment(
  //     {
  //       credentials: await httpAuth.credentials(req, { allow: ['user'] }),
  //     },
  //   );

  //   res.status(201).json(result);
  // });

  router.get('/getAssessments', async (req, res) => {

    const { teamId } = req.query;

    res.json(
      await teamAssessmentListService.getAssessments({
        credentials: await httpAuth.credentials(req, { allow: ['user'] })},
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
