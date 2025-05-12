// team-assessment/plugins/team-assessment-backend/src/plugin.ts

import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { createAssessmentListService } from './services/TodoListService/createAssessmentListService';
import { loadAssessmentConfig } from './utils/loadAssessmentConfig';

/**
 * The team-assessment backend plugin
 *
 * @public
 */
export const teamAssessmentBackendPlugin = createBackendPlugin({
  pluginId: 'team-assessment',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        catalog: catalogServiceRef,
      },
      async init({ logger, auth, httpAuth, httpRouter, catalog }) {
        loadAssessmentConfig()
          .then(() => logger.info('Config sync completed'))
          .catch(err => logger.error('Config sync failed', err));

        const teamAssessmentListService = await createAssessmentListService({
          logger,
          auth,
          catalog,
        });

        httpRouter.use(
          await createRouter({
            httpAuth,
            teamAssessmentListService,
          }),
        );

      },
    });
  },
});
