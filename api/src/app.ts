import express, { Request, Response, NextFunction } from 'express'
import compression from 'compression' // compresses requests
import session from 'express-session'
import flash from 'express-flash'
import mongoose from 'mongoose'
import passport from 'passport'
import morgan from 'morgan'
import cors from 'cors'
import router from './routes'
import connectMongo from 'connect-mongo'
import helmet from 'helmet'
import 'dotenv/config'

// *  Create Express server
const app = express()

// * Retrieve environment variables
app.set('port', process.env.API_PORT || 4000)
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/registrum'
const baseUrl = process.env.API_BASE_PATH || '/api'

// * Express configuration
app.options('*', cors())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))
app.use(helmet())

// Connect to MongoDB
mongoose.Promise = globalThis.Promise

mongoose
    .connect(mongoUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('✅ Connected to MongoDB 💾')
    })
    .catch(() => {
        console.log('❌ Could not connect to MondoDB. Please make sure MongoDB is running.')
        process.exit(1)
    })

const MongoStore = connectMongo(session)

// * Setup Express Session
app.use(
    session({
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        name: '_session',
        resave: false,
        saveUninitialized: false,
        unset: 'destroy',
        secret: process.env.SESSION_SECRET || 'This is not a secure secret!',
        proxy: process.env.NODE_ENV == 'production',
        cookie: { secure: 'auto', sameSite: true }
    })
)

// * Setup passport
app.use(passport.initialize())
app.use(passport.session())

// * Setup express-flash for route messaging
app.use(flash())

// * Set No Cache
router.use((_: Request, res: Response, next: NextFunction) => {
    res.set('Cache-Control', 'no-store')
    next()
})

// * Bind Routes to app
app.use(baseUrl, router)

export default app
export { mongoose }
