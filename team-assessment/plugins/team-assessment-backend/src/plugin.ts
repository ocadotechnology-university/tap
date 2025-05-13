/*  team-assessment backend ─ plugin.ts
    -----------------------------------
    Registers the Backstage backend plugin AND adds a file‑watcher
    so that editing assessment-config.yaml triggers live DB sync.
*/

import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { createRouter } from './router';
import { createAssessmentListService } from './services/TodoListService/createAssessmentListService';
import { loadAssessmentConfig } from './utils/loadAssessmentConfig';

import chokidar from 'chokidar'; // <── file‑system watcher
import path from 'path';

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
        // -----------------------------------------------------------------------
        // 1) Initial load of YAML → DB on plugin startup
        // -----------------------------------------------------------------------
        await loadAssessmentConfig({ fullSync: true, logger }).catch(err =>
          logger.error('Initial config sync failed', err),
        );

        // -----------------------------------------------------------------------
        // 2) Create service + router (unchanged application logic)
        // -----------------------------------------------------------------------
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

        // -----------------------------------------------------------------------
        // 3) Watch assessment-config.yaml for live edits
        // -----------------------------------------------------------------------
        const cfgPath = path.join(
          process.cwd(),
          '..',
          'app',
          'public',
          'assessment-config.yaml',
        );

        chokidar
          .watch(cfgPath, {
            ignoreInitial: true,
            awaitWriteFinish: {
              stabilityThreshold: 500,
            },
          })
          .on('change', async () => {
            logger.info('assessment-config.yaml changed – syncing to DB…');
            try {
              await loadAssessmentConfig({ fullSync: true, logger });
              logger.info('YAML sync completed successfully');
            } catch (err) {
              logger.error('YAML sync failed');
            }
          });
      },
    });
  },
});
