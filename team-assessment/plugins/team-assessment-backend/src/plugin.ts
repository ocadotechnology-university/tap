import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { createRouter } from './router';
import { createAssessmentListService } from './services/TodoListService/createAssessmentListService';
import { loadAssessmentConfig } from './utils/loadAssessmentConfig';
import { loadAccessConfig } from './utils/accessConfigLoader';
import chokidar from 'chokidar';
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
        // ───────────────────────────────────────────────────────────────
        // 1) Initial YAML loads
        // ───────────────────────────────────────────────────────────────
        await loadAssessmentConfig({ fullSync: true, logger }).catch(err =>
          logger.error('Initial config sync failed', err),
        );

        try {
          loadAccessConfig();
          logger.info('Access config loaded successfully');
        } catch (err) {
          logger.error('Initial access config load failed');
        }
        // ───────────────────────────────────────────────────────────────
        // 2) Create service + router
        // ───────────────────────────────────────────────────────────────
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

        // ───────────────────────────────────────────────────────────────
        // 3) Watch assessment-config.yaml
        // ───────────────────────────────────────────────────────────────
        const assessmentCfgPath = path.join(
          process.cwd(),
          '..',
          'app',
          'public',
          'assessment-config.yaml',
        );

        chokidar
          .watch(assessmentCfgPath, {
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

        // ───────────────────────────────────────────────────────────────
        // 4) Watch access-config.yaml
        // ───────────────────────────────────────────────────────────────
        const accessCfgPath = path.resolve(
          __dirname,
          'access-config.yaml',
        );

        chokidar
          .watch(accessCfgPath, {
            ignoreInitial: true,
            awaitWriteFinish: {
              stabilityThreshold: 500,
            },
          })
          .on('change', () => {
            logger.info('access-config.yaml changed – reloading config');
            try {
              loadAccessConfig();
              logger.info('Access config reload successful');
            } catch (err) {
              logger.error('Access config reload failed');
            }
          });
      },
    });
  },
});
