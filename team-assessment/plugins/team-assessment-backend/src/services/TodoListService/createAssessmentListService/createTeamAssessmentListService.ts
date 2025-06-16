import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import prisma from '../../../prismaClient';
import {
  Assessment,
  TeamAssessmentListService,
  HardSkill,
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

    async getHardSkillMarksByAssessment(options, assessmentId) {
      await options.credentials;
      const rows = await prisma.hardSkill.findMany({
        where: { assessmentId },
        select: { questionId: true, markId: true },
      });
      return rows as Array<{ questionId: number; markId: number }>;
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

    async getUserAssessmentStat(options, userId) {
      await options.credentials;

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

      const softSkills: Record<
        string,
        {
          _areaName: string;
          [competencyId: string]: {
            _competencyName: string;
            entries: { user: string; comment: string; mark: string }[];
          } | string;
        }
      > = {};

      const hardSkills: Record<
        string,
        { user: string; mark: string; _questionText?: string }[]
      > = {};

      for (const assessment of assessments) {
        const author = assessment.createdBy;

        for (const soft of assessment.softSkills) {
          const areaId = soft.areaId.toString();
          const competencyId = soft.competencyId.toString();
          const areaName = soft.area.text;
          const competencyName = soft.competency.text;

          const comments = soft.comments.map(comment => ({
            user: author,
            comment: comment.commentText,
            mark: comment.mark.text,
          }));

          if (!softSkills[areaId]) {
            softSkills[areaId] = { _areaName: areaName };
          }

          if (!softSkills[areaId][competencyId]) {
            softSkills[areaId][competencyId] = {
              _competencyName: competencyName,
              entries: [],
            };
          }

          (softSkills[areaId][competencyId] as any).entries.push(...comments);
        }

        for (const hard of assessment.hardSkills) {
          const questionId = hard.questionId.toString();
          const questionText = hard.section.text;

          hardSkills[questionId] ??= [];

          hardSkills[questionId].push({
            user: author,
            mark: hard.mark.text,
            _questionText: questionText,
          });
        }
      }

      return { softSkills, hardSkills };
    },

    async getAssessments(options, teamId) {
      const user = options.credentials.principal.userEntityRef;
      const rows = await prisma.assessment.findMany({
        where: { createdBy: user, groupId: teamId },
        select: { id: true, targetUser: true },
      });
      return rows.map(r => ({ targetUser: r.targetUser, id: r.id }));
    },

    async getSampleText(options) {
      const username = options.credentials.principal.userEntityRef;
      return { message: `Hello, ${username}!` };
    },
  };
}
