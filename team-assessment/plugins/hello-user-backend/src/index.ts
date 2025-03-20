import express from 'express';
import { DatabaseManager } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';

async function testDbConnection() {
  const config = new ConfigReader({
    backend: {
      database: {
        client: 'pg',
        connection: {
          host: 'localhost',
          port: 5432,
          user: 'postgres',
          password: 'Gotem1980',
        },
      },
    },
  });
  const dbManager = DatabaseManager.fromConfig(config).forPlugin('test');
  const knex = await dbManager.getClient();
  const result = await knex.raw('SELECT current_database() as db, current_user as user');
  return result.rows[0];
}

async function main() {
  const app = express();

  app.get('/db-check', async (_req, res) => {
    try {
      const info = await testDbConnection();
      res.json(info);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  app.listen(7007, () => {
    console.log('Backend started on port 7007');
  });
}

main().catch(console.error);
