import express from "express"
import bodyParser from "body-parser"
import compression from "compression"
import apicache from "apicache"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"

import BannerController from "./controllers/BannerController"

dotenv.config()

const CACHE_TIME = process.env.CACHE_TIME || "10 minutes"
const BASE_PATH = process.env.BASE_PATH || "/banner"
const PORT = parseInt(process.env.PORT) || 8088

export const app = express()

const cache = apicache.middleware

app.set("port", PORT)
app.use(morgan("tiny"))
app.use(bodyParser)
app.use(compression)
app.options("*", cors)

app.use(cache(CACHE_TIME))
app.use(BASE_PATH, BannerController)

app.listen(PORT, () => console.log(`🚀 Banner service running on port ${app.get("port")}. 🤘`))
