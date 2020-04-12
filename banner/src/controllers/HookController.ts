import { Request, Response } from 'express'
import { Controller } from '../interfaces/Controller'
import { WebHooks, URLExistsError, URLNotFoundError, NameNotFoundError } from '../lib/WebHooks'
import Redis from 'ioredis'
import * as mongoose from 'mongoose'
import { CourseSchema } from '../interfaces/Schemas'
import { Course } from '../lib/Banner'

export class HookController extends Controller {

    #webHooks: WebHooks
    #redisClient: Redis.Redis

    constructor(path: string, redisUri: string) {
        super(path)
        this.#redisClient = new Redis(redisUri)
        this.#webHooks = new WebHooks({ redisClient: this.#redisClient })
        this.#initializeRoutes()
        console.log('hook constructor')
        this.#initWatcher()
    }

    #initWatcher = () => {
        console.log('init watcher')
        const CourseModel = mongoose.model<Course & mongoose.Document>('Course', CourseSchema)
        CourseModel.watch().
            on('change', async (data: any) => {
                console.log(data.operationType)
                if (data && data.fullDocument && data.fullDocument.courseReferenceNumber) {
                    console.log('triggering')
                    this.#webHooks.trigger(data.fullDocument.courseReferenceNumber, {
                        content: '```json\n' + JSON.stringify(data.fullDocument) + '\n```'
                    })
                }
            })
    }

    #initializeRoutes = () => {
        console.log('init routes')
        this.router.put(this.path, this.#addHook)
        this.router.delete(this.path, this.#deleteHook)
    }

    #addHook = (request: Request, response: Response) => {
        const { crn, url } = request.body
        try {
            console.log('adding hook', crn, url)
            this.#webHooks.add(crn, url)
            this.created(response)
        }
        catch (error) {
            if (error instanceof URLExistsError)
                this.conflict(response)
            else
                this.fail(response, error)
        }
    }

    #deleteHook = (request: Request, response: Response) => {
        const { crn, url } = request.body
        console.log('deleting hook', crn, url)
        try {
            this.#webHooks.remove(crn, url)
            this.accepted(response)
        }
        catch (error) {
            if (error instanceof URLNotFoundError || error instanceof NameNotFoundError)
                this.notFound(response)
            else
                this.fail(response, error)
        }
    }

    // sub post with hook

    // unsub delete hook

    // subs for term
    // courseNumbers for subject
    // crn to class
    // subject and course number query
}
