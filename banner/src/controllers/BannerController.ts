import { Router, Request, Response } from 'express'
import { Banner } from '../lib/Banner'

export const BannerController = Router()

type BannerInstance = {
    term: string
    instance: Banner
}

const BannerInstances: BannerInstance[] = []

BannerController.post('/subscription', (req: Request, res: Response) => {
    const { term, subject, courseNumber, hook } = req.body;

    res.sendStatus(501)
})

BannerController.delete('/subscription', (req: Request, res: Response) => {
    res.sendStatus(501)
})

BannerController.get('/subscription', (req: Request, res: Response) => {
    res.sendStatus(501)
})

BannerController.get('/subscription/:id', (req: Request, res: Response) => {
    res.sendStatus(501)
})

BannerController.get('/class', (req: Request, res: Response) => {
    res.sendStatus(501)
})

BannerController.get('/class/:id', (req: Request, res: Response) => {
    res.sendStatus(501)
})

export default BannerController
