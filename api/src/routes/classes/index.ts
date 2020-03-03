import { Router, Request, Response } from "express"
const router = Router()
// * All routes under /classes/*

router.get("/userlist", (req: Request, res: Response) => {
    // TODO: Write route that returns list of users watched classes
    res.status(501).send("TODO")
})

router.post("/add", (req: Request, res: Response) => {
    // TODO: Write route that adds class to users list of watched classes
    res.status(501).send("TODO")
})

router.post("/remove", (req: Request, res: Response) => {
    // TODO: Write route that removes class from users list of watched classes
    res.status(501).send("TODO")
})

router.get("/subjects", (req: Request, res: Response) => {
    // TODO: Write route that grabs class subjects list from Banner DB and returns them
    res.status(501).send("TODO")
})

router.get("/list/:subject", (req: Request, res: Response) => {
    // TODO: Write route that grabs class list for provided subject from Banner DB and returns them
    res.status(501).send("TODO")
})

export default router