import 'dotenv/config'
import { App } from './app'
import { HookController } from './controllers/HookController'
import { BannerController } from './controllers/BannerController'

const cacheTime = process.env.CACHE_TIME || '100 minutes'
const basePath = process.env.BANNER_BASE_PATH || '/banner'
const port = parseInt(process.env.BANNER_PORT) || 4001
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/banner-data'
const redisUri = process.env.BANNER_REDIS_URI || 'redis://localhost'


const app = new App(
    [
        new HookController('/hook', redisUri),
        new BannerController('/', cacheTime),
    ],
    {
        port, basePath, mongoUri
    }
)

app.listen()
