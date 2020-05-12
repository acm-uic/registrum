import { Request, Response } from 'express'
import { Controller } from '../interfaces/Controller'
import { WebHooks, URLExistsError, URLNotFoundError, NameNotFoundError } from '../lib/WebHooks'
import * as mongoose from 'mongoose'
import { CourseSchema } from '../interfaces/Schemas'
import { Course } from '../lib/Banner'

export class HookController extends Controller {
    #webHooks: WebHooks

    constructor(path: string) {
        super(path)
        this.#webHooks = new WebHooks({ mongooseConnection: mongoose.connection })
        this.#initializeRoutes()
        this.#initWatcher()
    }

    #initWatcher = () => {
        const CourseModel = mongoose.model<Course & mongoose.Document>('Course', CourseSchema)
        CourseModel.watch().on('change', (data: any) => {
            console.log(data.operationType)
            if (data && data.fullDocument && data.fullDocument.courseReferenceNumber) {
                console.log('triggering')
                this.#webHooks.trigger(data.fullDocument.courseReferenceNumber, data.fullDocument)
            }
        })
    }

    #initializeRoutes = () => {
        this.router.post(this.path, this.#addHook)
        this.router.post('/deletehook', this.#deleteHook)
    }

    #addHook = async (request: Request, response: Response) => {
        const { key, url } = request.body
        console.log(key)
        try {
            await this.#webHooks.add(key, url)
            this.created(response)
        } catch (error) {
            if (error instanceof URLExistsError) this.conflict(response)
            else this.fail(response, error)
        }
    }

    #deleteHook = async (request: Request, response: Response) => {
        const { key, url } = request.body
        try {
            await this.#webHooks.remove(key, url)
            this.ok(response)
        } catch (error) {
            if (error instanceof URLNotFoundError || error instanceof NameNotFoundError)
                this.notFound(response)
            else this.fail(response, error)
        }
    }
}
