import * as express from 'express'
import * as compression from 'compression'
import * as apicache from 'apicache'
import * as cors from 'cors'
import * as dotenv from 'dotenv'
import * as morgan from 'morgan'

import BannerController from './controllers/BannerController'

dotenv.config()

const CACHE_TIME = process.env.CACHE_TIME || '10 minutes'
const BASE_PATH = process.env.BASE_PATH || '/banner'
const PORT = parseInt(process.env.PORT) || 4001

export const app = express()

const cache = apicache.middleware

app.set('port', PORT)
app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(compression())
app.options('*', cors)

app.use(cache(CACHE_TIME))
app.use(BASE_PATH, BannerController)
