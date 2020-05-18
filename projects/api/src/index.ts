import { App } from './app'
import { ClassesController } from './controllers/ClassesController'
import { AuthController } from './controllers/AuthController'
import { BannerController } from './controllers/BannerController'
import { PushServiceController } from './controllers/PushServiceController'

import 'dotenv/config'

const basePath = process.env.API_BASE_PATH || '/api'
const port = parseInt(process.env.API_PORT) || 4000
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/registrum'
const serviceName = 'Registrum-API'

export const app = new App(
    [
        new ClassesController('/classes'),
        new AuthController('/auth'),
        new BannerController('/banner', { notifyUrl: 'http://localhost:4000/api/banner' }),
        new PushServiceController('/push-service')
    ],
    {
        port,
        basePath,
        mongoUri,
        serviceName
    }
)

app.listen()
