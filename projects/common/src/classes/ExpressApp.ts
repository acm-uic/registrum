import * as express from 'express'
import * as compression from 'compression'
import * as cors from 'cors'
import * as morgan from 'morgan'
import * as mongoose from 'mongoose'
import { Controller } from './Controller'
export type AppConfig = {
    port: number
    basePath: string
    serviceName: string
    mongoUri?: string
}

export abstract class ExpressApp {
    #app: express.Application
    #config: AppConfig

    constructor(controllers: Controller[], config: AppConfig) {
        this.#app = express()
        this.#config = config

        this.#initializeBaseMiddlewares()
        this.#initializeDatabase()
        this.#initializeControllers(controllers)
    }
    get app() {
        return this.#app
    }

    #initializeDatabase = async () => {
        if (!this.#config.mongoUri) return
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

    #initializeBaseMiddlewares = () => {
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
            console.log(
                `🚀 ${this.#config.serviceName} service running on port ${this.#config.port}. 🤘`
            )
        })
    }
}
