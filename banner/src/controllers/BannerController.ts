import { Request, Response } from 'express'
import { Controller } from '../interfaces/Controller'
import * as mongoose from 'mongoose'

export class BannerController extends Controller {

    #db: mongoose.Mongoose;

    constructor(path: string, mongoUri: string) {
        super(path)
        this.#initializeRoutes()
        mongoose
            .connect(mongoUri, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            }).then(db => {
                this.#db = db
            })
    }

    #initializeRoutes = () => {
        this.router.get(this.path, this.#getSubject)
        this.router.get(this.path, this.#getTerm)
    }

    #getSubject = (request: Request, response: Response) => {
        //a
    }

    #getTerm = (request: Request, response: Response) => {
        //a
    }

}
