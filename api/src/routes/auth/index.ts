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

//* this route will be used when updating user's password
router.post('/checkPassword', isAuthenticated, async (req: Request, res: Response) => {
    // * Grab needed elements from request body
    const { oldPassword } = req.body
    
    //* get the user object
    const user = (req.user as UserObject);

    //* get user's database entry
    const userDatabaseEntry = await User.findOne({ _id: user._id })

    // * Check if password is correct
    if (!(await bcrypt.compare(oldPassword, userDatabaseEntry.password))) {
        res.status(401).send('Error') //* Sending status 401 since old password was incorrect 
        return
    }

    // * Sending status 200 because old password was correct
    res.status(200).send("Old Password is correct")

})


// * this route will update user's password
router.post('/updatePassword', isAuthenticated, async (req: Request, res: Response) => {
    // * Grab needed elements from request body
    const { password } = req.body
    
    //* get the user object
    const user = (req.user as UserObject);

    // * hashing password and updating entry database
    const response = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: { password: await bcrypt.hash(password, 2) } },
        { rawResult: true, new: true }
    )

    // * Sending status of database update
    if (response.ok === 1) res.status(200).send("Password has been updated")
    else res.status(500).send('Error')

})

// * this route will update user's account info
router.post('/updateAccountInfo', isAuthenticated, async (req: Request, res: Response) => {
    // * Grab needed elements from request body
    const { fName, lName } = req.body
    
    //* get the user object
    const user = (req.user as UserObject);

    // * Updating firstname and lastname entry in database
    const response = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: { firstname: fName, lastname: lName } },
        { rawResult: true, new: true }
    )

    // * Sending status of database update
    if (response.ok === 1) res.status(200).send("Account Info has been updated")
    else res.status(500).send('Error')

})



router.post("/update", isAuthenticated, async (req: Request, res: Response) => { 
    // * Get the user object
    const user = (req.user as UserObject);
    
    // * Grab password out of body
    const { userPassword } = req.body

    // * If password is not provided, send error status
    if(!userPassword) {
        res.status(401).send("Password not provided")
        return
    }

    // * Grab up to date user from database
    const userDatabaseEntry = await User.findOne({_id: user._id})

    // * Make sure provided password is correct
    if( ! (await bcrypt.compare(userPassword, userDatabaseEntry.password))) {
        res.status(401).send("Password not valid")
        return
    }

    // * Grab updates from body
    let updates = req.body

    try {
        // * If password is provided, hash said password
        if(updates.password) {
            updates.password = bcrypt.hash(updates.password, 2)
        }
    
        // * Update in mongoose
        await User.updateOne({_id: user._id}, updates)
        res.status(200).send("OK")
    }
    catch(err) {
        res.status(500).send('Error')
    }
    
    
})


export default router
