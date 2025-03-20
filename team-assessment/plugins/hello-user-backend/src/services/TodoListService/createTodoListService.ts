import { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { Knex } from 'knex';
import crypto from 'node:crypto';
import { TodoItem, TodoListService } from './types';

export async function createTodoListService({
  auth,
  logger,
  catalog,
  db,
}: {
  auth: AuthService;
  logger: LoggerService;
  catalog: typeof catalogServiceRef.T;
  db: Knex;
}): Promise<TodoListService> {
  logger.info('Initializing TodoListService');

  await db.schema.hasTable('todos').then(exists => {
    if (!exists) {
      return db.schema.createTable('todos', table => {
        table.string('id').primary();
        table.string('title');
        table.string('createdBy');
        table.string('createdAt');
      });
    }
  });

  return {
    async createTodo(input, options) {
      let title = input.title;
      if (input.entityRef) {
        const { token } = await auth.getPluginRequestToken({
          onBehalfOf: options.credentials,
          targetPluginId: 'catalog',
        });
        const entity = await catalog.getEntityByRef(input.entityRef, { token });
        if (!entity) {
          throw new NotFoundError(`No entity found for ref '${input.entityRef}'`);
        }
        const entityDisplay = entity.metadata.title ?? input.entityRef;
        title = `[${entityDisplay}] ${input.title}`;
      }

      const id = crypto.randomUUID();
      const createdBy = options.credentials.principal.userEntityRef;
      const newTodo: TodoItem = {
        title,
        id,
        createdBy,
        createdAt: new Date().toISOString(),
      };

      await db('todos').insert(newTodo);
      logger.info('Created new todo item', { id, title, createdBy });
      return newTodo;
    },

    async listTodos() {
      const items = await db<TodoItem>('todos').select('*');
      return { items };
    },

    async getTodo({ id }) {
      const todo = await db<TodoItem>('todos').where({ id }).first();
      if (!todo) {
        throw new NotFoundError(`No todo found with id '${id}'`);
      }
      return todo;
    },
  };
}
