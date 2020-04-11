import * as express from 'express'
import * as compression from 'compression'
import * as apicache from 'apicache'
import * as cors from 'cors'
import * as morgan from 'morgan'
import { Controller } from './interfaces/Controller'
export type AppConfig = {
    port: number;
    basePath: string;
    cacheTime: string;
    mongoUri: string;
}

export class App {
    #app: express.Application;
    #config: AppConfig

    constructor(controllers: Controller[], config: AppConfig) {
        this.#app = express()
        this.#config = config

        this.#initializeMiddlewares()
        this.#initializeControllers(controllers)
    }

    #initializeMiddlewares = () => {
        this.#app.set('port', this.#config.port)
        this.#app.use(morgan('tiny'))
        this.#app.use(express.urlencoded({ extended: true }))
        this.#app.use(express.json())
        this.#app.use(compression())
        this.#app.options('*', cors)
        this.#app.use(apicache.middleware(this.#config.cacheTime))
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
