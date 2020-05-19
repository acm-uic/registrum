import { Request, Response } from 'express'
import { WebHooks } from '@bmiddha/webhooks'
import mongoose from 'mongoose'
import { Controller } from 'registrum-common/dist/classes/Controller'
import { CourseSchema } from 'registrum-common/dist/schemas/Banner'
import { Course } from 'registrum-common/dist/lib/Banner'

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
        this.router.post('/addHook', this.#addHook)
        this.router.post('/deletehook', this.#deleteHook)
    }

    #addHook = async (request: Request, response: Response) => {
        const { key, url } = request.body
        console.log(key)
        await this.#webHooks.add(key, url)
        this.created(response)
    }

    #deleteHook = async (request: Request, response: Response) => {
        const { key, url } = request.body
        await this.#webHooks.remove(key, url)
        this.ok(response)
    }
}
