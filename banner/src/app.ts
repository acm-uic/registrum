import * as express from 'express'
import * as compression from 'compression'
import * as cors from 'cors'
import * as morgan from 'morgan'
import * as mongoose from 'mongoose'
import { Controller } from './interfaces/Controller'
export type AppConfig = {
    port: number;
    basePath: string;
    mongoUri: string;
}

export class App {
    #app: express.Application
    #config: AppConfig

    constructor(controllers: Controller[], config: AppConfig) {
        this.#app = express()
        this.#config = config

        this.#initializeDatabase()
        this.#initializeMiddlewares()
        this.#initializeControllers(controllers)
    }

    #initializeDatabase = async () => {
        try {
            await mongoose.connect(this.#config.mongoUri, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            })
            console.log('✅ MongoDB connection successful.')
        } catch (error) {
            console.log('❌ MongoDB connection unsuccessful.')
        }

    }

    #initializeMiddlewares = () => {
        this.#app.set('port', this.#config.port)
        this.#app.use(morgan('tiny'))
        this.#app.use(express.urlencoded({ extended: true }))
        this.#app.use(express.json())
        this.#app.use(compression())
        this.#app.options('*', cors)
    }

    #initializeControllers = (controllers: Controller[]) => {
        controllers.forEach(controller => {
            this.#app.use(this.#config.basePath, controller.router)
        })
    }

    listen() {
        this.#app.listen(this.#config.port, () => {
            console.log(`🚀 Banner service running on port ${this.#config.port}. 🤘`)
        })
    }
}
