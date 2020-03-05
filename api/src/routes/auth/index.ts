import { Router, Request, Response } from 'express'
import passport from 'passport'
import User from '../models/User'
import bcrypt from 'bcrypt'
// * Bind Passport stategies
import './passport'
import { isAuthenticated } from './passport'

const router = Router()

/* Remove data shouldn't be sent to client E.g. password */
const stripData = userData => {
    let result = JSON.parse(JSON.stringify(userData))
    delete result['password']
    return result
}

// * All routes under /auth/*
router.get('/', isAuthenticated, (req: Request, res: Response) => {
    res.status(200).send('OK')
})

/* Login by passport.authenticate */
router.post(
    '/login',
    passport.authenticate('local', { failureFlash: true }),
    async (req: Request, res: Response) =>
        res.status(200).json(stripData(await User.findOne({ email: req.body.email })))
)

/* Login by Google - WIP to allow Student to signin with their school account*/
router.post('/loginGoogle', (req: Request, res: Response) => {
    // TODO: Login with passport Google strategy ?
    res.status(501).send('TODO')
})

/* Logout Route: Validation handled by passport */
router.get('/logout', isAuthenticated, (req: Request, res: Response) => {
    req.logout()
    res.send('OK')
})

// * Registration route
router.post('/signup', async (req: Request, res: Response) => {
    // * Grab needed elements from request body
    const { firstname, lastname, email, password } = req.body

    // * Check if user already exists
    const test = await User.findOne({ email })
    if (test) {
        res.status(400).send('Email already exists!')
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
        res.status(401).send('Error during registration')
        return
    }

    // * Login User
    req.login(user, err => {
        if (err) {
            res.status(401).send('Error logging in')
        } else {
            /* Return user data is successfully signup */
            res.status(200).json(stripData(user))
        }
    })
})

export default router
