import dotenv from 'dotenv'
import axios from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import app, { mongoose, redisClient } from '../app'
import { Server } from 'http'
import express, { Request, Response } from 'express'

dotenv.config()
const port = process.env.API_PORT || 8085
const basePath = process.env.API_BASE_PATH || '/api'
const URL = `http://localhost:${port}${basePath}/`

// * Create mock express isntance
const mockApp = express()
mockApp.get('/banner/subject', (req: Request, res: Response) => res.send(['CS']))
mockApp.get('/banner/term', (req: Request, res: Response) => res.send(['12345']))
mockApp.post('/banner/class', (req: Request, res: Response) => res.send({ courseNumber: '111' }))
describe('Class Tests', () => {
    let server: Server
    let bannerServer: Server

    // * Add Axios Cookie Jar
    const jar = new CookieJar()
    const client = axios.create({
        baseURL: URL,
        withCredentials: true,
        jar: jar,
        validateStatus: () => {
            /* always resolve on any HTTP status */
            return true
        }
    })

    axiosCookieJarSupport(client)

    beforeAll(async () => {
        bannerServer = mockApp.listen(4001, () => console.log('MOCK APP LISTENING'))

        server = app.listen(port)
        const response = await client.post('auth/signup', {
            firstname: 'John',
            lastname: 'Doe',
            email: 'registrum@example.com',
            password: 'theRealApp1$'
        })

        expect(response.status).toBe(200)
    })

    afterAll(async () => {
        // * Remove all users from DB
        await new Promise((resolve, reject) => {
            mongoose.connection.db.dropCollection('users', function (err, result) {
                resolve()
            })
        })

        // * Close DB Connection
        await new Promise((resolve, reject) => {
            mongoose.connection.close(() => {
                resolve()
            })
        })

        // * Quit Redis Client
        await new Promise(resolve => {
            redisClient.quit(() => {
                resolve()
            })
        })
        // ? SOURCE: https://stackoverflow.com/questions/52939575/node-js-jest-redis-quit-but-open-handle-warning-persists
        // * redis.quit() creates a thread to close the connection.
        // * We wait until all threads have been run once to ensure the connection closes.
        await new Promise(resolve => setImmediate(resolve))

        // * Close Server
        server.close()
        bannerServer.close()
    })

    describe('Sanity tests', () => {
        it('Returns a valid list of terms', async () => {
            // * Grab terms
            const { data: terms } = await client.get('classes/terms')

            // * Assure each term is valid by checking it is a number
            terms.forEach(term => {
                expect(() => parseInt(term)).not.toThrow()
            })
        })

        it('Returns a valid list of subjects for a retrieved term', async () => {
            // * Grab subjects for given term
            const { data: subjects } = await client.get(`classes/subjects`)

            // * Make sure each subject is a valid string
            subjects.forEach(subject => {
                expect(typeof subject === typeof String)
            })
        })

        it('Returns a valid list of courses for a given subject', async () => {
            // * Grab subjects for given term
            const { data: subjects } = await client.get(`classes/subjects`)

            // * Grab classes for given subject
            const { data: classes } = await client.get(`classes/list/${subjects[0]}`)
            console.log(classes)
            // * Make sure each class is a valid class object
            classes.forEach(cls => {
                expect(typeof cls).toBe(String)
            })
        })
    })

    describe('Edge case tests', () => {
        it('Returns an empty array of classes for an invalid subject', async () => {
            // * Try to retrieve classes
            const { data: classes } = await client.get('/classes/list/invalidSubjectHere')
            expect(classes).toHaveLength(0)
        })
    })
})
