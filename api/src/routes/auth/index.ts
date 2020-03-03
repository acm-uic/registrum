import { Router, Request, Response } from "express"
import passport from "passport"
import User from "../models/User"
import bcrypt from "bcrypt"
// * Bind Passport stategies
import "./passport"
import { isAuthenticated } from "./passport"

const router = Router()

// * All routes under /auth/*
router.get("/", isAuthenticated, (req: Request, res: Response) => {
    res.status(200).send("OK")
})

router.post(
    "/login",
    passport.authenticate("local", { failureFlash: true }),
    (req: Request, res: Response) => res.status(200).send("OK")
)

router.post("/loginGoogle", (req: Request, res: Response) => {
    // TODO: Login with passport Google strategy ?
    res.status(501).send("TODO")
})

router.get("/logout", isAuthenticated, (req: Request, res: Response) => {
    // * If session exists, destroy session, otherwise send error
    if (req.session.user)
        req.session.destroy(() => {
            res.status(200).end()
        })
    else res.status(401).send({ error: "You cannot logout if you aren't logged in!" })
})

// * Registration route
router.post("/signup", async (req: Request, res: Response) => {
    // * Grab needed elements from request body
    const { firstname, lastname, email, password } = req.body

    // * Check if user already exists
    const test = await User.findOne({ email })
    if (test) {
        res.status(400).send("Email already exists!")
        return
    }

    // * Hash password
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(password, 2)
    } catch (err) {
        console.error(err)
    }

    // * Setup User
    const user = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword
    })

    // * Save user
    try {
        console.log(user)
        await user.save()
    } catch (err) {
        console.error(err.message)
        res.status(401).send("Error during registration")
        return
    }

    // * Login User
    req.login(user, err => {
        if (err) {
            res.status(401).send("Error logging in")
        } else {
            res.status(200).send("OK")
        }
    })
})

module.exports = router
