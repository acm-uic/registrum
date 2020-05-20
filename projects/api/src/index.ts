import { App } from './app'

import 'dotenv/config'

const basePath = process.env.API_BASE_PATH || '/api'
const port = parseInt(process.env.API_PORT) || 4000
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/registrum'
const serviceName = 'Registrum-API'

export const app = new App({
    auto: true,
    port,
    basePath,
    mongoUri,
    serviceName
})

if (require.main === module) {
    app.listen()
}
