import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
// import crypto from 'node:crypto';
import { Assessment, TeamAssessmentListService } from './types';
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
    // async createAssessment(options) {
    //   const createdBy = options.credentials.principal.userEntityRef;

    //   const newAssessment = prisma.assessment.create({
    //     data: {
    //       createdBy
    //     }
    //   })

    //   logger.info('Created new assessment by', { createdBy });

    //   return newAssessment;
    // },

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