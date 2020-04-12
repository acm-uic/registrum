import { Request, Response } from 'express'
import { Controller } from '../interfaces/Controller'
import { TermModel, SubjectModel, CourseModel } from '../interfaces/Models'
import * as apicache from 'apicache'

export class BannerController extends Controller {

    constructor(path: string, cacheTime: string) {
        super(path)
        this.router.use(apicache.middleware(cacheTime))
        this.#initializeRoutes()
    }

    #initializeRoutes = () => {
        this.router.get('/subject', this.#getSubject)
        this.router.get('/term', this.#getTerm)
        this.router.get('/crn', this.#getCourseReferenceNumber)
    }

    #getCourseReferenceNumber = async (request: Request, response: Response) => {
        this.ok(response, (await CourseModel.find({})).map(course => course.courseReferenceNumber))
    }

    #getSubject = async (request: Request, response: Response) => {
        this.ok(response, await SubjectModel.find({}))
    }

    #getTerm = async (request: Request, response: Response) => {
        this.ok(response, await TermModel.find({}))
    }

}
