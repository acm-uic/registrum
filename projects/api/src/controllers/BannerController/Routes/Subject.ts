import { Handler, Request, Response } from 'express'
import Subject from '../../../models/Subject'

export class SubjectRoutes {
    static ALL: Handler[] = [
        async (req: Request, res: Response): Promise<void> => {
            // * Retrieve all the subjects
            const terms = await Subject.find({})

            res.status(200).send(terms)
        }
    ]

    static SPECIFIC: Handler[] = [
        async (req: Request, res: Response): Promise<void> => {
            // * Retrieve the subject id
            const id = req.params.id
            if (!id) res.status(400).send('Invalid Query')

            // * Retrieve the subject with the id
            const term = await Subject.find({ _id: id })

            // * Send client the subject
            res.status(200).send(term)
        }
    ]
}
