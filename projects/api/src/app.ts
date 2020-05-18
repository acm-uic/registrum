import { Request, Response, NextFunction } from 'express'
import session from 'express-session'
import flash from 'express-flash'
import mongoose from 'mongoose'
import passport from 'passport'
import connectMongo from 'connect-mongo'
import helmet from 'helmet'
import { Controller } from 'registrum-common/dist/classes/Controller'
import { ExpressApp, AppConfig } from 'registrum-common/dist/classes/ExpressApp'
import 'dotenv/config'

export class App extends ExpressApp {
    constructor(controllers: Controller[], config: AppConfig) {
        super(controllers, config)
        this.#initializeMiddlewares()
    }
    #initializeMiddlewares = () => {
        this.app.use(helmet())
        this.app.use(
            session({
                store: new (connectMongo(session))({ mongooseConnection: mongoose.connection }),
                name: '_session',
                resave: false,
                saveUninitialized: false,
                unset: 'destroy',
                secret: process.env.SESSION_SECRET || 'This is not a secure secret!',
                proxy: process.env.NODE_ENV == 'production',
                cookie: { secure: 'auto', sameSite: true }
            })
        )
        this.app.use(passport.initialize())
        this.app.use(passport.session())
        this.app.use(flash())
        this.app.use((_: Request, res: Response, next: NextFunction) => {
            res.set('Cache-Control', 'no-store')
            next()
        })
    }
}
