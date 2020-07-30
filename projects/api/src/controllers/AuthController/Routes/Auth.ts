import { Handler, Request, Response } from 'express'
import passport from 'passport'

import User from '../../../models/User'

export class AuthRoutes {
    static LOGIN: Handler[] = [
        // * Authenticate using passport
        passport.authenticate('local', { failureFlash: false }),

        async (req: Request, res: Response): Promise<void> => {
            // * Get the user from the database using the email
            const user = await User.findOne({ email: req.body.email }, '-_id -password -__v')

            // * Send the user object to client
            res.status(200).send(user)
        }
    ]

    static LOGOUT: Handler[] = [
        async (req: Request, res: Response): Promise<void> => {
            // * Logout of the current session
            req.logOut()

            // * Send null as the user
            res.status(200).send(null)
        }
    ]
}
