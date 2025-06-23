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

  router.put('/comment/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { commentText } = req.body;

    if (!commentText?.trim()) {
      return res.status(400).json({ error: 'commentText is required' });
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { commentText: commentText.trim() },
    });

    res.status(200).json({
      id: updated.id,
      commentText: updated.commentText,
    });
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

  router.get('/my-assessments', async (req, res) => {
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });
    const userEntityRef = credentials.principal.userEntityRef;

    const assessments = await prisma.assessment.findMany({
      where: {
        createdBy: userEntityRef,
      },
      include: {
        hardSkills: true,
        softSkills: true,
      },
    });

    res.status(200).json(assessments);
  });

  router.get('/getAllAssessments', async (req, res) => {
    const assessments = await prisma.assessment.findMany({
      select: {
        createdBy: true,
        targetUser: true,
        date: true,
      },
    });

    res.status(200).json(assessments);
  });

  router.get('/user-assessments', async (req, res) => {
    const { userId } = req.query;
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required' });
    }

    const assessments = await prisma.assessment.findMany({
      where: { targetUser: userId },
      include: {
        hardSkills: {
          include: {
            section: true,
            mark: true,
          },
        },
        softSkills: {
          include: {
            area: true,
            competency: true,
            comments: {
              include: {
                mark: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(assessments);
  });
  router.get('/user-assessment-stat', async (req, res) => {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required' });
    }

    const credentials = await httpAuth.credentials(req, { allow: ['user'] });

    const data = await teamAssessmentListService.getUserAssessmentStat(
      { credentials },
      userId,
    );

    res.status(200).json(data);
  });

  /* -------- SOFT -------- */
  router.get('/leader-soft-decision/:assessmentId', async (req, res) => {
    const assessmentId = Number(req.params.assessmentId);
    if (!assessmentId)
      return res.status(400).json({ error: 'assessmentId' });

    const row = await prisma.leaderAssessment.findUnique({
      where: { assessmentId },
      select: { assessmentId: true, finalSoftDecision: true, reviewedAt: true },
    });
    if (!row) return res.status(404).json({ error: 'not found' });
    res.status(200).json(row);
  });

  router.put('/leader-soft-decision/:assessmentId', async (req, res) => {
    const assessmentId = Number(req.params.assessmentId);
    if (!assessmentId)
      return res.status(400).json({ error: 'assessmentId' });

    const { finalSoftDecision } = req.body ?? {};
    if (typeof finalSoftDecision !== 'string')
      return res.status(400).json({ error: 'finalSoftDecision required' });

    const saved = await prisma.leaderAssessment.upsert({
      where: { assessmentId },
      update: { finalSoftDecision },
      create: { assessmentId, finalSoftDecision },
    });

    res.status(200).json({
      assessmentId: saved.assessmentId,
      finalSoftDecision: saved.finalSoftDecision,
      reviewedAt: saved.reviewedAt,
    });
  });

  /* -------- HARD -------- */
  router.get('/leader-hard-decision/:assessmentId', async (req, res) => {
    const assessmentId = Number(req.params.assessmentId);
    if (!assessmentId)
      return res.status(400).json({ error: 'assessmentId' });

    const row = await prisma.leaderAssessment.findUnique({
      where: { assessmentId },
      select: { assessmentId: true, finalHardDecision: true, reviewedAt: true },
    });
    if (!row) return res.status(404).json({ error: 'not found' });
    res.status(200).json(row);
  });

  router.put('/leader-hard-decision/:assessmentId', async (req, res) => {
    const assessmentId = Number(req.params.assessmentId);
    if (!assessmentId)
      return res.status(400).json({ error: 'assessmentId' });

    const { finalHardDecision } = req.body ?? {};
    if (typeof finalHardDecision !== 'string')
      return res.status(400).json({ error: 'finalHardDecision required' });

    const saved = await prisma.leaderAssessment.upsert({
      where: { assessmentId },
      update: { finalHardDecision },
      create: { assessmentId, finalHardDecision },
    });

    res.status(200).json({
      assessmentId: saved.assessmentId,
      finalHardDecision: saved.finalHardDecision,
      reviewedAt: saved.reviewedAt,
    });
  });
  return router;
}