import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import crypto from 'node:crypto';
import {
  Assessment,
  TeamAssessmentListService,
  HardSkill,
  SectionRow,
  MarkRow,
  Competency
} from './types';
import prisma from '../../../prismaClient'

// TEMPLATE NOTE:
// This is a simple in-memory todo list store. It is recommended to use a
// database to store data in a real application. See the database service
// documentation for more information on how to do this:
// https://backstage.io/docs/backend-system/core-services/database
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

  // const storedAssessments = new Array<Assessment>();

  return {
    async createAssessment(options, targetUser, teamId) {
      const createdBy = options.credentials.principal.userEntityRef;

      const newAssessment = await prisma.assessment.create({
        data: {
          createdBy: createdBy,
          targetUser: targetUser,
          groupId: teamId
        }
      })

      logger.info('Created new assessment by', { createdBy });

      return newAssessment;
    },


    async upsertHardSkill(options, assessmentId, questionId, markId) {
      const createdBy = options.credentials.principal.userEntityRef;
      await prisma.hardSkill.upsert({
        where: { assessmentId_questionId: { assessmentId, questionId } },
        update: { markId },
        create: { assessmentId, questionId, markId },
      })
      logger.info('Created new hardSkillMark by', { createdBy });
      return { assessmentId, questionId, markId } as HardSkill
    },

    async getHardSkillSections(options) {
      const createdBy = options.credentials.principal.userEntityRef;
      const rows = await prisma.hardSkillsSection.findMany({
        select: { id: true, text: true },
      });
      logger.info('Created new getHardSkillSections by', { createdBy });
      return rows as SectionRow[];
    },

    async getHardSkillMarks(options) {
      const createdBy = options.credentials.principal.userEntityRef;
      const rows = await prisma.hardSkillsMark.findMany({
        select: { id: true, text: true },
      });
      logger.info('Created new getHardSkillSections by', { createdBy });
      return rows as MarkRow[];
    },

    async getSoftSkillAreas(options) {
      const rows = await prisma.area.findMany({
        select: { id: true, text: true },
      });

      return rows as SectionRow[];
    },

    async getSoftSkillMarks(options) {
      const rows = await prisma.softSkillsMark.findMany({
        select: { id: true, text: true },
      });

      return rows as MarkRow[];
    },

    async getSoftSkillCompetencies(options) {
      const rows = await prisma.competency.findMany({
        select: { areaId: true, competencyId: true, text: true },
      });

      return rows as Competency[];
    },

    async addComment(options, key, markId, commentText) {
      const createdBy = options.credentials.principal.userEntityRef;
      const newComment = await prisma.comment.create({
        data: {
          key: key,
          markId: markId,
          commentText: commentText,
        },
      });

      logger.info('Created comment by ', { createdBy });

      return {
        id: newComment.id.toString(),
        commentText: newComment.commentText,
      };
    },

    async getAssessments(options, teamId) {
      const user = options.credentials.principal.userEntityRef;
      const assessments = await prisma.assessment.findMany({
        where: {
          createdBy: user,
          groupId: teamId
        },
        select: {
          targetUser: true
        }
      }).then(assessments => assessments.map(a => a.targetUser));

      return assessments;
    },

    async getSampleText(options) {
      const username = options.credentials.principal.userEntityRef;
      return { message: `Hello, ${username}!` };
    },
  };
}
