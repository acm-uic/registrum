import passport from 'passport'
import Local from 'passport-local'
import User, { IUser } from '../models/User'
import bcrypt from 'bcrypt'
import { NextFunction, Request, Response } from 'express'

// * Setup serialization and Deserialization functions
passport.serializeUser((user: IUser, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findOne({ _id: id })
        done(null, user)
    } catch (err) {
        done(err)
    }
})

// * Setup Passport Strategies
passport.use(
    new Local.Strategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            console.log('AUTH' + email + password)
            const user = await User.findOne({ email })

            // * Check if user exists
            if (!user) {
                return done(null, false, { message: 'Invalid email or password!' })
            }

            // * Check if password is correct
            if (!(await bcrypt.compare(password, user.password))) {
                return done(null, false, { message: 'Invalid email or password!' })
            }
            console.log('SUCCESS')
            // * Return user
            return done(null, user)
        } catch (err) {
            return done(err)
        }
    })
)

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        console.log('USER NOT LOGGED IN')
        res.status(401).send('Error, Not logged in')
    }
}
