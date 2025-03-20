import { createBackendPlugin, coreServices } from '@backstage/backend-plugin-api';
import { DatabaseManager } from '@backstage/backend-common';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import express from 'express';
import { createRouter } from './router';
import { createTodoListService } from './services/TodoListService';

export const helloUserPlugin = createBackendPlugin({
  pluginId: 'hello-user',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        auth: coreServices.auth,
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        catalog: catalogServiceRef,
        config: coreServices.rootConfig,
      },
      async init({ logger, auth, httpAuth, httpRouter, catalog, config }) {
        const dbManager = DatabaseManager.fromConfig(config).forPlugin('hello-user');
        const knex = await dbManager.getClient();
        const todoListService = await createTodoListService({
          logger,
          auth,
          catalog,
          db: knex,
        });
        const mainRouter = await createRouter({ httpAuth, todoListService });
        const connectionRouter = express.Router();
        connectionRouter.get('/connection-info', async (req, res) => {
          try {
            const result = await knex.raw('SELECT current_database() as db, current_user as user');
            res.json({ db: result.rows[0].db, user: result.rows[0].user });
          } catch (error) {
            logger.error(String(error));
            res.status(500).json({ error: String(error) });
          }
        });
        httpRouter.use(mainRouter);
        httpRouter.use(connectionRouter);
      },
    });
  },
});
