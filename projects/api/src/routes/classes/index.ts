import { Router, Request, Response } from 'express'
// * All routes under /classes/*
const router = Router()

import { BannerClient } from '../../util/banner'

router.get('/list/:term/:subject', async (req: Request, res: Response) => {
    const { subject, term } = req.params
    // * FOR NOW, CHECK AGAINST HASH MAP
    const courseNumbers = {}
    const { data: classes } = await BannerClient.post('/class', { term, subject })
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
})

router.get('/subjects', async (req: Request, res: Response) => {
    try {
        const { data: subjectsResponse } = await BannerClient.get('/subject')
        res.send(subjectsResponse)
    } catch (err) {
        res.send([])
    }
})

router.get('/terms', async (req: Request, res: Response) => {
    try {
        const { data: termResponse } = await BannerClient.get('/term')
        res.send(termResponse)
    } catch (err) {
        res.send([])
    }
})

router.get('/listing/:term/:subject/:courseNumber', async (req: Request, res: Response) => {
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
})

export default router
