import passport from 'passport'
import Local from 'passport-local'
import User, { IUser } from '../models/User'
import { validatePassword } from './util'

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
    new Local.Strategy(async (email, password, done) => {
        try {
            const user = await User.findOne({ email })

            // * Check if user exists
            if (!user) {
                return done(null, false, { message: 'Invalid email or password!' })
            }

            // * Check if password is correct
            if (!validatePassword(password)) {
                return done(null, false, { message: 'Invalid email or password!' })
            }

            // * Return user
            return done(null, user)
        } catch (err) {
            return done(err)
        }
    })
)
