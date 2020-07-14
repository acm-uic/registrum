import { Handler, Request, Response } from 'express'
import passport from 'passport'

import User from '../../../models/User'
import { AuthController } from '..'

export const LOGIN: Handler[] = [
    // * Authenticate using passport
    passport.authenticate('local', { failureFlash: false }),

    async (req: Request, res: Response): Promise<void> => {
        // * Get the user from the database using the email and remove password hash field
        const user = await User.findOne({ email: req.body.email })
        const clientUser = AuthController.prepareClientObject(user)

        // * Send the user object to client
        res.status(200).send(clientUser)
    }
]

export const LOGOUT: Handler[] = [
    async (req: Request, res: Response): Promise<void> => {
        // * Logout of the current session
        req.logOut()

        // * Send null as the user
        res.status(200).send(null)
    }
]
