import { Request, Response } from 'express'
import { Controller } from 'registrum-common/dist/classes/Controller'
import { BannerClient } from '../util/banner'

export class ClassesController extends Controller {
    constructor(path: string) {
        super(path)
        this.#initializeRoutes()
    }

    #initializeRoutes = () => {
        this.router.get('/list/:term/:subject', this.#getList)
        this.router.get('/subjects', this.#getSubjects)
        this.router.get('/terms', this.#getTerms)
        this.router.post('/listing/:term/:subject/:courseNumber', this.#getListing)
    }

    #getList = async (req: Request, res: Response) => {
        const { subject, term } = req.params
        // * FOR NOW, CHECK AGAINST HASH MAP
        const courseNumbers: {
            [key: string]: boolean
        } = {}
        const classes: { courseNumber: string }[] = (
            await BannerClient.post('/class', { term, subject })
        ).data
        classes.forEach(cls => {
            if (!courseNumbers[cls.courseNumber]) courseNumbers[cls.courseNumber] = true
            else return
        })

        const courseNumberArray = Object.keys(courseNumbers)

        if (courseNumberArray.length == 0) {
            res.send([])
        } else {
            res.send(courseNumberArray)
        }
    }

    #getSubjects = async (req: Request, res: Response) => {
        try {
            const { data: subjectsResponse } = await BannerClient.get('/subject')
            res.send(subjectsResponse)
        } catch (err) {
            res.send([])
        }
    }

    #getTerms = async (req: Request, res: Response) => {
        try {
            const { data: termResponse } = await BannerClient.get('/term')
            res.send(termResponse)
        } catch (err) {
            res.send([])
        }
    }

    #getListing = async (req: Request, res: Response) => {
        try {
            const { subject, courseNumber, term } = req.params
            const { data: listingResponse } = await BannerClient.post('/class', {
                subject,
                courseNumber,
                term
            })
            res.send(listingResponse)
        } catch (err) {
            res.send([])
        }
    }
}
