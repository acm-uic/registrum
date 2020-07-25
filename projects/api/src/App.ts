import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import connectMongo from 'connect-mongo';
import helmet from 'helmet';
import { ExpressApp } from 'registrum-common/dist/classes/ExpressApp';
import { ClassesController } from './controllers/ClassesController';
import { AuthController } from './controllers/AuthController';
import { BannerController } from './controllers/BannerController';
import { PushServiceController } from './controllers/PushServiceController';
import compression from 'compression';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

type Config = {
  mongoUri: string;
  port: number;
  basePath: string;
  serviceName: string;
  bannerUrl: string;
  apiHost: string;
};

export class App extends ExpressApp {
  config: Config;
  constructor(config: Config, cb?: () => void) {
    super(config.port, config.basePath, config.serviceName);
    this.config = config;

    this.initializeDatabase().then(() => {
      this.initializeMiddlewares();
      this.initializeControllers();
      this.configure();
      if (cb) cb();
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
      throw '❌ MongoDB connection unsuccessful.';
    }
  };
  initializeMiddlewares = () => {
    this.bindMiddlewares([
      morgan('tiny'),
      express.urlencoded({ extended: true }),
      express.json(),
      compression(),
      helmet(),
      session({
        store: new (connectMongo(session))({ mongooseConnection: mongoose.connection }),
        name: '_session',
        resave: false,
        saveUninitialized: false,
        unset: 'destroy',
        secret: process.env.SESSION_SECRET || 'This is not a secure secret!',
        proxy: process.env.NODE_ENV == 'production',
        cookie: { secure: 'auto', sameSite: true }
      }),
      passport.initialize(),
      passport.session(),
      (_: Request, res: Response, next: NextFunction) => {
        res.set('Cache-Control', 'no-store');
        next();
      }
    ]);
  };
  initializeControllers = () => {
    this.bindControllers([
      new ClassesController(`/classes`, { bannerUrl: this.config.bannerUrl }),
      new AuthController(`/auth`),
      new BannerController(`/banner`, {
        notifyUrl: `${this.config.apiHost}${this.config.basePath}/banner`,
        bannerUrl: this.config.bannerUrl
      }),
      new PushServiceController(`/push-service`)
    ]);
  };
}
