import express from "express"
import compression from "compression" // compresses requests
import session from "express-session"
import bodyParser from "body-parser"
import flash from "express-flash"
import mongoose from "mongoose"
import morgan from "morgan"
import router from "./routes"

// *  Create Express server
const app = express()

// * Retrieve environment variables
require("dotenv").config()
app.set("port", process.env.PORT)
console.log(process.env.PORT)
const redisUrl = process.env.REDIS_URL || "redis://localhost"
const mongoUrl = process.env.MONGODB_URI || "mongodb://localhost/cs494Final"
const baseUrl = process.env.BASE_URL || "/"

// Connect to MongoDB
mongoose.Promise = globalThis.Promise

mongoose
    .connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    })
    .catch(err => {
        console.log("MongoDB connection error. Please make sure MongoDB is running. " + err)
        process.exit()
    })

// * Logger
app.use(morgan('tiny'))

// * Express configuration
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// * Initialize Redis Client and Redis Session Store
const redis = require("redis")
const redisClient = redis.createClient(redisUrl)
const RedisStore = require("connect-redis")(session)

// * Setup Express Session
app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET || "This is not a secure secret!",
        store: new RedisStore({ client: redisClient, secret: "CHANGE THIS", resave: false })
    })
)

// * Setup express-flash for route messaging
app.use(flash())

// * Bind Routes to app
app.use(baseUrl, router)

export default app
