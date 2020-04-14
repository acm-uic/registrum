import { Request, Response } from 'express'
import { Controller } from '../interfaces/Controller'
import { TermModel, SubjectModel, CourseModel } from '../interfaces/Models'
// import * as apicache from 'apicache'

export class BannerController extends Controller {
    constructor(path: string, cacheTime: string) {
        super(path)
        // ! disable cache for dev
        // this.router.use(apicache.middleware(cacheTime))
        this.#initializeRoutes()
    }

    #initializeRoutes = () => {
        this.router.get('/subject', this.#getSubject)
        this.router.get('/term', this.#getTerm)
        this.router.get('/crn', this.#getCourseReferenceNumber)
        this.router.post('/course', this.#getCourse)
        this.router.post('/class', this.#getClass)
    }

    #getClass = async (request: Request, response: Response) => {
        const { subject, courseNumber } = request.body
        if (subject == undefined && courseNumber == undefined) {
            response.status(400).send('Params not provided!')
        } else if (subject == undefined) {
            this.ok(
                response,
                await CourseModel.find({
                    courseNumber: { $in: courseNumber }
                })
            )
        } else if (courseNumber == undefined) {
            this.ok(
                response,
                await CourseModel.find({
                    subject: { $in: subject }
                })
            )
        } else {
            this.ok(
                response,
                await CourseModel.find({
                    subject: { $in: subject },
                    courseNumber: { $in: courseNumber }
                })
            )
        }
    }
    #getCourse = async (request: Request, response: Response) => {
        this.ok(
            response,
            await CourseModel.find({
                _id: { $in: request.body.courseReferenceNumbers }
            })
        )
    }

    #getCourseReferenceNumber = async (_: Request, response: Response) => {
        this.ok(
            response,
            (await CourseModel.find({})).map(course => course.courseReferenceNumber)
        )
    }

    #getSubject = async (_: Request, response: Response) => {
        this.ok(response, await SubjectModel.find({}))
    }

    #getTerm = async (_: Request, response: Response) => {
        this.ok(response, await TermModel.find({}))
    }
}
