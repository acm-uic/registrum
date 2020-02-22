import { Router, Request, Response } from "express"
const router = Router()

// * All routes under /auth/*
router.post("/login", (req: Request, res: Response) => {
    // TODO: Login with traditional Local Strategy
    res.status(501).send("TODO")
})

router.post("/loginGoogle", (req: Request, res: Response) => {
    // TODO: Login with passport Google strategy ?
    res.status(501).send("TODO")
})

router.get("/logout", (req: Request, res: Response) => {
    // * If session exists, destroy session, otherwise send error
    if (req.session.user)
        req.session.destroy(() => {
            res.status(200).end()
        })
    else res.status(401).send({ error: "You cannot logout if you aren't logged in!" })
})

module.exports = router
