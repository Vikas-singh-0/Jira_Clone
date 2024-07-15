import 'dotenv/config';
import 'reflect-metadata';

import express from 'express';
import cors from 'cors';
import createDatabaseConnection from './database/createConnection';

const establishDatabaseConnection = async (): Promise<void> => {
  try {
    await createDatabaseConnection().initialize();
  } catch (error) {
    console.log(error);
  }
};

const initializeExpress = (): void => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use('/', (_req, res) => {
    res.json({s: 100});
  })

  app.listen(process.env.PORT || 3000)
}

const initializeApp = async ():Promise<void> => {
  await establishDatabaseConnection();
    initializeExpress();
} 

initializeApp();




