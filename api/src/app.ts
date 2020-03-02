import express from 'express'
import compression from 'compression' // compresses requests
import session from 'express-session'
import bodyParser from 'body-parser'
import flash from 'express-flash'
import mongoose from 'mongoose'
import passport from 'passport'

// *  Create Express server
const app = express()

// * Retrieve environment variables
require('dotenv').config()
app.set('port', process.env.PORT)
console.log(process.env.PORT)

const cors = require('cors')({ origin: true })
app.use(cors)
app.options('*', cors)

// * Express configuration
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Connect to MongoDB
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/cs494Final'
mongoose.Promise = globalThis.Promise

mongoose
    .connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
        console.log('connected to mongoDB')
    })
    .catch(err => {
        console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err)
        process.exit()
    })

// * Initialize Redis Client and Redis Session Store
const redis = require('redis')
const redisClient = redis.createClient()
const RedisStore = require('connect-redis')(session)

// * Setup Express Session
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET || 'This is not a secure secret!',
        store: new RedisStore({ client: redisClient, secret: 'CHANGE THIS', resave: false })
    })
)

// * Setup passport
app.use(passport.initialize())
app.use(passport.session())

// * Setup express-flash for route messaging
app.use(flash())

// * Bind Routes to app
require('./routes')(app)

// app.use('/', expressRoutes)

export default app
