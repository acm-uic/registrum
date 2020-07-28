import { Handler, Request, Response } from 'express'
import Term from '../../../models/Term'

export class TermRoutes {
    static ALL: Handler[] = [
        async (req: Request, res: Response): Promise<void> => {
            // * Retrieve all the terms
            const terms = await Term.find({})

            res.status(200).send(terms)
        }
    ]

    static SPECIFIC: Handler[] = [
        async (req: Request, res: Response): Promise<void> => {
            // * Retrieve the term id
            const id = req.params.id
            if (!id) res.status(400).send('Invalid Query')

            // * Retrieve the term with the id
            const term = await Term.find({ _id: id })

            // * Send client the term
            res.status(200).send(term)
        }
    ]
}
