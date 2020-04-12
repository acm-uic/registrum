import express from 'express'
import compression from 'compression' // compresses requests
import session from 'express-session'
import flash from 'express-flash'
import mongoose from 'mongoose'
import passport from 'passport'
import morgan from 'morgan'
import cors from 'cors'
import router from './routes'
import dotenv from 'dotenv'
dotenv.config({path: '../.env'})
// *  Create Express server
const app = express()

// * Retrieve environment variables
require('dotenv').config()
app.set('port', process.env.PORT || 4000)
const redisUrl = process.env.REDIS_URL || 'redis://localhost'
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/cs494Final'
const baseUrl = process.env.BASE_PATH || '/api'

// * Express configuration
app.options('*', cors)
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
    useFindAndModify: false,
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
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    )
    process.exit()
  })

// * Initialize Redis Client and Redis Session Store
const redis = require('redis')
const redisClient = redis.createClient(redisUrl)

const RedisStore = require('connect-redis')(session)
const SessionStore = new RedisStore({ client: redisClient, resave: false })
SessionStore.client.unref()

// * Setup Express Session
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || 'This is not a secure secret!',
    store: SessionStore,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
)

// * Setup passport
app.use(passport.initialize())
app.use(passport.session())

// * Setup express-flash for route messaging
app.use(flash())

// * Bind Routes to app
app.use(baseUrl, router)

export default app
export { mongoose, redisClient }
