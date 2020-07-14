import { Handler, Request, Response } from 'express'
import * as bcrypt from 'bcrypt'
import User, { UserObject } from '../../../models/User'
import { AuthController } from '..'

export const GET: Handler[] = [
    async (req: Request, res: Response): Promise<void> => {
        // * Get the user from the database using the email and remove password hash field
        const { _id } = req.user as UserObject
        const user = await User.findOne({ _id: _id })
        const clientUser = AuthController.prepareClientObject(user)

        // * Send the user object to client
        res.status(200).send(clientUser)
    }
]

export const POST: Handler[] = [
    async (req: Request, res: Response): Promise<void> => {
        // * Grab needed elements from request body
        const { firstname, lastname, email, password } = req.body
        const validator = AuthController.ValidationExpressions

        // * Check against the format criteria
        if (!validator.name.test(firstname) || !validator.name.test(lastname)) {
            res.status(400).send('Name is invalid')
            return
        } else if (!validator.email.test(email)) {
            res.status(400).send('Email is invalid')
            return
        } else if (!validator.password.test(password)) {
            res.status(400).send('Password is not strong enough')
            return
        } else if (await User.findOne({ email })) {
            // * Check if user already exists
            res.status(400).send('Email already exists!')
            return
        }

        // * Setup User
        const user = await new User({
            firstname,
            lastname,
            email,
            // * Hashed Password
            password: await bcrypt.hash(password, 2)
        }).save()

        // * Login using the newly created user
        req.login(user, () => {
            // * Return user data after successfully login
            res.status(200).json(AuthController.prepareClientObject(user))
        })
    }
]

export const PUT: Handler[] = [
    async (req: Request, res: Response): Promise<void> => {
        // * Get the user object
        const user = req.user as UserObject

        // * Grab password out of body
        const { userPassword } = req.body

        // * If password is not provided, send error status
        if (!userPassword) {
            res.status(401).send('Password not provided')
            return
        }

        // * Grab up to date user from database
        const userDatabaseEntry = await User.findOne({ _id: user._id })

        // * Make sure provided password is correct
        if (!(await bcrypt.compare(userPassword, userDatabaseEntry.password))) {
            res.status(401).send('Invalid Password')
            return
        }

        // * Grab updates from body
        const updates = req.body
        const validator = AuthController.ValidationExpressions
        try {
            // requestBody check (Prevent changing prohibited column)
            if (updates._id || updates.subscriptions) {
                res.status(400).send('Info update input violation')
                return
            }

            // * If password is provided, hash said password
            if (updates.password) {
                // * Verify the the password is adhering to out standard
                // * Length is at least than 8
                // * Has one lower case and upper case English letter
                // * Has one digit and one special character
                if (!validator.password.test(updates.password)) {
                    res.status(400).send('Password is not strong enough')
                    return
                }
                updates.password = await bcrypt.hash(updates.password, 2)
            }

            if (updates.lastname) {
                // * Verify that the first and last name is valid
                if (!validator.name.test(updates.lastname)) {
                    res.status(400).send('Last name is invalid')
                    return
                }
            }
            if (updates.firstname) {
                // * Verify that the first and last name is valid
                if (!validator.name.test(updates.firstname)) {
                    res.status(400).send('First name is invalid')
                    return
                }
            }
            if (updates.email) {
                // * Verify that the email matches according to W3C standard
                if (!validator.email.test(updates.email)) {
                    res.status(400).send('Email is invalid')
                    return
                }
            }

            // * Update in mongoose
            let updatedUser = await User.findOneAndUpdate({ _id: user._id }, updates, {
                new: true
            })

            // * Delete unnecessary keys
            updatedUser = JSON.parse(JSON.stringify(updatedUser))
            delete updatedUser['_id']
            delete updatedUser['password']
            delete updatedUser['__v']

            // * Makes sure unnecessary keys/values are not sent
            res.status(200).send(updatedUser)
        } catch (err) {
            res.status(500).send('Error')
        }
    }
]

export const DELETE: Handler[] = [
    async (req: Request, res: Response): Promise<void> => {
        throw new Error('TODO: Not Implemented')
    }
]
