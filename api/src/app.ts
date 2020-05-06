import express, { Request, Response, NextFunction } from 'express'
import compression from 'compression' // compresses requests
import session from 'express-session'
import flash from 'express-flash'
import mongoose from 'mongoose'
import passport from 'passport'
import morgan from 'morgan'
import cors from 'cors'
import router from './routes'
import dotenv from 'dotenv'
import Redis from 'ioredis'
import connectRedis from 'connect-redis'
import 'dotenv/config'

dotenv.config({ path: '.env' })
// *  Create Express server
const app = express()

// * Retrieve environment variables
app.set('port', process.env.API_PORT || 4000)
const redisUri = process.env.API_REDIS_URI || 'redis://localhost:6379'
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/registrum'
const baseUrl = process.env.API_BASE_PATH || '/api'

// * Express configuration
app.options('*', cors())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))

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
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        //console.log("connected to mongoDB")
        // // * Drop classes collection
        // mongoose.connection.db.dropCollection('users', function(err, result) {
        //     // * Populate list of classes
        // })
    })
    .catch(err => {
        console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err)
        process.exit(1)
    })

// * Initialize Redis Client and Redis Session Store
const redisClient = new Redis(redisUri)

const RedisStore = connectRedis(session)
const SessionStore = new RedisStore({ client: redisClient })

// * Setup Express Session
app.use(
    session({
        resave: true,
        proxy: process.env.NODE_ENV == 'production',
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET || 'This is not a secure secret!',
        store: SessionStore,
        cookie: { secure: process.env.NODE_ENV == 'production' } // * API Will be served behind reverse proxy, does not need to be secure
    })
)

// * Setup passport
app.use(passport.initialize())
app.use(passport.session())

// * Setup express-flash for route messaging
app.use(flash())

// * Set No Cache
router.use((req: Request, res: Response, next: NextFunction) => {
    res.set('Cache-Control', 'no-store')
    next()
})

// * Bind Routes to app
app.use(baseUrl, router)

export default app
export { mongoose, redisClient }
