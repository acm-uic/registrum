import axios, { AxiosInstance } from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { App } from '../app'
import mongoose from 'mongoose'
import { Server } from 'http'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mockApp from './mockbanner'

describe('Class Tests', () => {
    // * ENV variables
    const basePath = process.env.API_BASE_PATH || '/api'

    const port = 8085
    const baseURL = `http://localhost:${port}${basePath}/`

    // * Mongo Setup
    const mongoServer: MongoMemoryServer = new MongoMemoryServer()
    const mongoUri = 'mongodb://localhost:27017/testing1'
    // const mongoUri = mongoServer.getUri()

    // * Create the app with the configurations
    const expressApp = new App({
        auto: false,
        port,
        basePath,
        mongoUri: mongoUri,
        serviceName: 'API'
    })

    let server: Server
    const jar = new CookieJar()
    const bannerServer: Server = mockApp.listen(4001, () => console.log('MOCK APP LISTENING'))

    // * Create axios client
    const client: AxiosInstance = axios.create({
        withCredentials: true,
        baseURL,
        jar,
        validateStatus: () => {
            /* always resolve on any HTTP status */
            return true
        }
    })
    axiosCookieJarSupport(client)

    beforeAll(async () => {
        // * Finish app setup
        await expressApp.initializeDatabase()
        expressApp.initializeMiddlewares()
        expressApp.initializeControllers()
        expressApp.configure()

        // * Start listening
        server = expressApp.listen()

        const response = await client.post('/auth/signup', {
            firstname: 'John',
            lastname: 'Doe',
            email: 'registrum@example.com',
            password: 'theRealApp1$'
        })

        expect(response.status).toBe(200)
    })

    afterAll(async () => {
        // * Remove all users from DB
        await new Promise(resolve => {
            mongoose.connection.db.dropCollection('users', () => {
                resolve()
            })
        })

        // * Close DB Connection
        await new Promise(resolve => {
            mongoose.connection.close(() => {
                resolve()
            })
        })

        // * We wait until all threads have been run once to ensure the connection closes.
        await new Promise(resolve => setImmediate(resolve))

        // * Close Server
        server.close()
        await mongoose.disconnect()
        mongoServer.stop()
        bannerServer.close()
    })

    describe('Sanity tests', () => {
        it('Returns a valid list of terms', async () => {
            // * Grab terms
            const { data: terms } = await client.get('/classes/terms')

            // * Assure each term is valid by checking it is a number
            terms.forEach((term: string) => {
                expect(() => parseInt(term)).not.toThrow()
            })
        })

        it('Returns a valid list of subjects for a retrieved term', async () => {
            // * Grab subjects for given term
            const { data: subjects } = await client.get(`/classes/subjects`)

            // * Make sure each subject is a valid string
            subjects.forEach((subject: string) => {
                expect(typeof subject === typeof String)
            })
        })

        it('Returns a valid list of courses for a given subject', async () => {
            // * Grab subjects for given term
            const { data: subjects } = await client.get(`/classes/subjects`)
            console.log(subjects)
            // * Grab classes for given subject
            const { data: classes } = await client.get(`/classes/list/220208/${subjects[0]}`)
            console.log(classes)
            // * Make sure each class is a valid class object
            classes.forEach((cls: string) => {
                expect(typeof cls === typeof String)
            })
        })
    })

    describe('Edge case tests', () => {
        it('Returns an empty array of classes for an invalid subject', async () => {
            // * Try to retrieve classes
            const { data: classes } = await client.get('/classes/list/220208/invalidSubjectHere')
            expect(classes).toHaveLength(0)
        })
    })

    // ! Could not find proper way to mock api requests in testing in time
    // describe('CRN Tests', () => {
    //     // it('Can query by CRN', () => {
    //     //     test.todo
    //     // })
    //     // it('Invalid CRN yields empty query', () => {
    //     //     test.todo
    //     // })
    // })
})
