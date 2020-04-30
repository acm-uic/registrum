import * as dotenv from 'dotenv'
import { App } from './app'
import { HookController } from './controllers/HookController'
import { BannerController } from './controllers/BannerController'

dotenv.config()

const cacheTime = process.env.CACHE_TIME || '100 minutes'
const basePath = process.env.BANNER_BASE_PATH || '/banner'
const port = parseInt(process.env.BANNER_PORT) || 4001
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27000/banner-data'
const redisUri = process.env.BANNER_REDIS_URI || 'redis://localhost:6380'

const app = new App([new HookController('/hook', redisUri), new BannerController('/', cacheTime)], {
    port,
    basePath,
    mongoUri
})

app.listen()
