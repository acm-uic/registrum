import dotenv from "dotenv"
import axios from "axios"
// import User from '../routes/models/User'
import { app } from "../index"

dotenv.config()
const PORT = process.env.PORT || 8081
const URL = `http://localhost:${PORT}/classes/`

const server = app.listen(PORT)

describe("Class Tests", () => {
    afterAll(async () => {
        console.log("Test")
    })

    const cookie = ""
    const classID = ""
    const client = axios.create({
        baseURL: URL,
        validateStatus: () => {
            /* always resolve on any HTTP status */
            console.log("Test")
            return true
        }
    })

    describe("Precondition Tests", () => {
        it("Register an account", async () => {
            console.log("Test")
        })
    })
})
