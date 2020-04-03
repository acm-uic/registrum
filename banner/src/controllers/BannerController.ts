import { Router, Request, Response } from "express"
import { Banner } from "../lib/Banner"

export const BannerController = Router()

type BannerInstance = {
    term: string;
    instance: Banner;
}

BannerController.get("/class/:term/:subject/:courseNumber", async (req: Request, res: Response) => {
    const { term, subject, courseNumber } = req.params
    res.send(await new Banner(term, subject).search({ courseNumber }))
})

export default BannerController
