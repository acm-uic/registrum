import { ExpressApp } from 'registrum-common/dist/classes/ExpressApp';
import { HookController } from './controllers/HookController';
import { BannerController } from './controllers/BannerController';
import compression from 'compression';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

type Config = {
  mongoUri: string;
  port: number;
  basePath: string;
  serviceName: string;
};

export class App extends ExpressApp {
  config: Config;

  constructor(config: Config) {
    super(config.port, config.basePath, config.serviceName);
    this.config = config;
    this.initializeDatabase().then(() => {
      this.initializeMiddlewares();
      this.initializeControllers();
      this.configure();
    });
  }

  configure = () => {
    this.app.options('*', cors);
  };

  initializeDatabase = async () => {
    try {
      await mongoose.connect(this.config.mongoUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      });
      console.log('✅ MongoDB connection successful.');
    } catch (error) {
      console.log(error);
      throw '❌ MongoDB connection unsuccessful.';
    }
  };

  initializeMiddlewares = () => {
    this.bindMiddlewares([
      morgan('tiny'),
      express.urlencoded({ extended: true }),
      express.json(),
      compression()
    ]);
  };

  initializeControllers = () => {
    this.bindControllers([new HookController('/hook'), new BannerController('/')]);
  };
}
