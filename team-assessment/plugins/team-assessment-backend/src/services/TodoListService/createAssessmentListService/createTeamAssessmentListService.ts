/* plugins/team-assessment-backend/src/services/TodoListService/createAssessmentListService/createTeamAssessmentListService.ts */

import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import prisma from '../../../prismaClient';
import {
  Assessment,
  TeamAssessmentListService,
  HardSkill,
  SectionRow,
  MarkRow,
  Competency,
} from './types';

export async function createAssessmentListService({
  auth,
  logger,
  catalog,
}: {
  auth: AuthService;
  logger: LoggerService;
  catalog: typeof catalogServiceRef.T;
}): Promise<TeamAssessmentListService> {
  logger.info('Initializing AssessmentListService');

  return {
    async createAssessment(options, targetUser, teamId) {
      const createdBy = options.credentials.principal.userEntityRef;
      const newAssessment = await prisma.assessment.create({
        data: { createdBy, targetUser, groupId: teamId },
      });
      logger.info('Created new assessment', { createdBy });
      return newAssessment as Assessment;
    },

    async upsertHardSkill(options, assessmentId, questionId, markId) {
      const createdBy = options.credentials.principal.userEntityRef;
      await prisma.hardSkill.upsert({
        where: { assessmentId_questionId: { assessmentId, questionId } },
        update: { markId },
        create: { assessmentId, questionId, markId },
      });
      logger.info('Upsert hard-skill mark', { createdBy });
      return { assessmentId, questionId, markId } as HardSkill;
    },

    async getHardSkillSections() {
      return prisma.hardSkillsSection.findMany({ select: { id: true, text: true } });
    },

    async getHardSkillMarks() {
      return prisma.hardSkillsMark.findMany({ select: { id: true, text: true } });
    },

    async getSoftSkillAreas() {
      return prisma.area.findMany({ select: { id: true, text: true } });
    },

    async getSoftSkillMarks() {
      return prisma.softSkillsMark.findMany({ select: { id: true, text: true } });
    },

    async getSoftSkillCompetencies() {
      return prisma.competency.findMany({
        select: { areaId: true, competencyId: true, text: true },
      });
    },

    async upsertSoftSkillComment(
      options,
      assessmentId,
      areaId,
      competencyId,
      markId,
      commentId,
      commentText,
    ) {
      const createdBy = options.credentials.principal.userEntityRef;

      let entry = await prisma.softSkillsTable.findFirst({
        where: { assessmentId, areaId, competencyId },
      });

      if (!entry) {
        const generatedKey = assessmentId * 100 + areaId * 10 + competencyId;
        entry = await prisma.softSkillsTable.create({
          data: { assessmentId, areaId, competencyId, key: generatedKey },
        });
      }

      const comment = commentId
        ? await prisma.comment.update({
          where: { id: commentId },
          data: { commentText, markId },
        })
        : await prisma.comment.create({
          data: { key: entry.key, markId, commentText },
        });

      logger.info('Upsert soft-skill comment', { createdBy });

      return {
        id: comment.id.toString(),
        commentText: comment.commentText,
        key: entry.key,
      };
    },

    async getSoftSkillComment(options, assessmentId, areaId, competencyId, markId) {
      await options.credentials;
      const row = await prisma.comment.findFirst({
        where: { markId, softSkill: { assessmentId, areaId, competencyId } },
        orderBy: { id: 'desc' },
      });
      return row
        ? { id: row.id.toString(), commentText: row.commentText }
        : null;
    },

    async getSoftSkillComments(options, assessmentId) {
      await options.credentials;
      const rows = await prisma.comment.findMany({
        where: { softSkill: { assessmentId } },
        select: {
          id: true,
          commentText: true,
          markId: true,
          softSkill: { select: { areaId: true, competencyId: true } },
        },
      });
      return rows.map(r => ({
        id: r.id,
        commentText: r.commentText,
        markId: r.markId,
        areaId: r.softSkill.areaId,
        competencyId: r.softSkill.competencyId,
      }));
    },

    async getAssessments(options, teamId) {
      const user = options.credentials.principal.userEntityRef;
      return prisma.assessment
        .findMany({
          where: { createdBy: user, groupId: teamId },
          select: { targetUser: true },
        })
        .then(rows => rows.map(r => r.targetUser));
    },

    async getSampleText(options) {
      const username = options.credentials.principal.userEntityRef;
      return { message: `Hello, ${username}!` };
    },
  };
}