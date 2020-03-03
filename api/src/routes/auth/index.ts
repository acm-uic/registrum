import { Router, Request, Response } from 'express'
import passport from 'passport'
import User from '../models/User'
import bcrypt from 'bcrypt'
// * Bind Passport stategies
import './passport'

const router = Router()

// * All routes under /auth/*
router.post('/login', passport.authenticate('local', { failureFlash: true }))

router.post('/loginGoogle', (req: Request, res: Response) => {
    // TODO: Login with passport Google strategy ?
    res.status(501).send('TODO')
})

router.get('/logout', (req: Request, res: Response) => {
    // * If session exists, destroy session, otherwise send error
    if (req.session.user)
        req.session.destroy(() => {
            res.status(200).end()
        })
    else res.status(401).send({ error: "You cannot logout if you aren't logged in!" })
})

// * Registration route
router.post('/signup', async (req: Request, res: Response) => {
    const { email, password } = req.body

    const test = await User.findOne({ email })
    if (test) {
        res.status(400).send('Email already exists!')
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
        email,
        password: hashedPassword
    })

    try {
        // TODO: Add bcrypt password hashing
        await user.save()
    } catch (err) {
        res.status(401).send('Error during registration')
    }

    req.login(user, err => {
        res.status(401).send('Error logging in')
    })
})

module.exports = router
