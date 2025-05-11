import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './router';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { createAssessmentListService } from './services/TodoListService/createAssessmentListService';

/**
 * The team asessment backend plugin
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
