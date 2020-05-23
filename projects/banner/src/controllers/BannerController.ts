import { Request, Response } from 'express'
import { Controller } from 'registrum-common/dist/classes/Controller'
import { TermModel, SubjectModel, CourseModel } from '../interfaces/Models'

export class BannerController extends Controller {
    constructor(path: string) {
        super(path)
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
        const { subject, courseNumber, term } = request.body
        if (!subject && !courseNumber && !term) {
            response.status(400).send('Params not provided!')
        } else {
            const filter = {
                subject: { $in: subject },
                courseNumber: { $in: courseNumber },
                term: { $in: term }
            }
            if (!subject) delete filter.subject
            if (!courseNumber) delete filter.courseNumber
            if (!term) delete filter.term
            this.ok(response, await CourseModel.find(filter))
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
