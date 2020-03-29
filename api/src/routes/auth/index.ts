import { Router, Request, Response } from 'express'
import passport from 'passport'
import User, { UserObject } from '../models/User'
import bcrypt from 'bcrypt'
// * Bind Passport stategies
import './passport'
import { isAuthenticated } from './passport'

const router = Router()

// * Remove data shouldn't be sent to client
const stripData = data => {
    const result = JSON.parse(JSON.stringify(data))
    delete result['password']
    return result
}

// * All routes under /auth/*
router.get('/', isAuthenticated, async (req: Request, res: Response) => {
    res.status(200).json(stripData(await User.findOne({ _id: (req.user as UserObject)._id })))
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

    // * Verify that the first and last name is valid
    const nameRegex = /^[^0-9\.\,\"\?\!\;\:\#\$\%\&\(\)\*\+\-\/\<\>\=\@\[\]\\\^\_\{\}\|\~]+$/
    if (!nameRegex.test(firstname) || !nameRegex.test(lastname)) {
        res.status(400).send('Name is invalid')
        return
    }

    // * Verify that the email matches according to W3C standard
    if (
        !RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, 'i').test(
            email
        )
    ) {
        res.status(400).send('Email is invalid')
        return
    }

    // * Verify the the password is adhering to out standard
    // * Length is atleast than 8
    // * Has one lower case and upper case English letter
    // * Has one digit and one special character
    if (
        !RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'i').test(
            password
        )
    ) {
        res.status(400).send('Password is not strong enough')
        return
    }

    // * Check if user already exists
    const test = await User.findOne({ email })
    if (test) {
        res.status(400).send('Email already exists!')
        return
    }

    // * Setup User
    const user = new User({
        firstname,
        lastname,
        email,
        // * Hashed Password
        password: await bcrypt.hash(password, 2)
    })

    // * Save user
    await user.save()

    // * Login User
    req.login(user, () => {
        /* Return user data is successfully signup */
        res.status(200).json(stripData(user))
    })
})

// * this route will update user's password
router.post('/updatePassword', async (req: Request, res: Response) => {
    // * Grab needed elements from request body
    const { password } = req.body
    
    //* get the user object
    const user = (req.user as UserObject);

    const response = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: { password: password } },
        { rawResult: true, new: true }
    )

    if (response.ok === 1) res.status(200).send("Password has been updated")
    else res.status(500).send('Error')

})

export default router
