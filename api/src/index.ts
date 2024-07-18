import 'module-alias/register';
import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
// import './middleware/response';

// import createDatabaseConnection from 'database/createConnection';
// import { addRespondToResponse } from './middleware/response';
// import { authenticateUser } from './middleware/authentication';
import { handleError } from './middleware/errors';
import { RouteNotFoundError } from './errors';

import { attachPublicRoutes, attachPrivateRoutes } from './routes';
import { DataSource } from 'typeorm';
import createTestAccount from './database/createTestAccount';

const createDatabaseConnection = () => {
  return new DataSource({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      // entities: Object.values(entities),
      synchronize: true,
    });
}

const establishDatabaseConnection = async (): Promise<void> => {
  try {
    await createDatabaseConnection();
  } catch (error) {
    console.log(error);
  }
};

const initializeExpress = (): void => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded());

  // app.use(addRespondToResponse);

  attachPublicRoutes(app);

  app.get('/runtests', () => {
    createTestAccount()
  });

  attachPrivateRoutes(app);

  app.use((req, _res, next) => next(new RouteNotFoundError(req.originalUrl)));
  app.use(handleError);

  app.listen(process.env.PORT || 3000);
};

const initializeApp = async (): Promise<void> => {
  await establishDatabaseConnection();
  initializeExpress();
};

initializeApp();
