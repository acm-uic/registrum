import * as express from 'express'
import { Controller } from './Controller'

type Middleware = (req: express.Request, res: express.Response, next: express.NextFunction) => void

export abstract class ExpressApp {
    #app: express.Application
    #basePath: string
    #serviceName: string
    #port: number

    constructor(port: number, basePath: string, serviceName: string) {
        this.#port = port
        this.#basePath = basePath
        this.#serviceName = serviceName
        this.#app = express()
    }
    get app() {
        return this.#app
    }

    bindMiddlewares = (middlewares?: Middleware[]) => {
        if (middlewares) for (const middleware of middlewares) this.#app.use(middleware)
    }

    bindControllers = (controllers?: Controller[]) => {
        if (controllers)
            controllers.forEach(controller => {
                this.#app.use(`${this.#basePath}${controller.path}`, controller.router)
            })
    }

    listen = (port?: number) => {
        this.#app.set('port', port !== undefined ? port : this.#port)
        return this.#app.listen(this.#app.get('port'), () => {
            console.log(
                `🚀 ${this.#serviceName} service running on port ${this.#app.get('port')}. 🤘`
            )
        })
    }
}
