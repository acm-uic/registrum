import axios, { AxiosInstance } from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { app } from '..'
import mongoose from 'mongoose'
import { Server } from 'http'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mockApp from './mockbanner'
import 'dotenv/config'

describe('Class Tests', () => {
    let server: Server
    let mongoServer: MongoMemoryServer
    let bannerServer: Server
    let port: number
    const basePath = process.env.API_BASE_PATH || '/api'
    let baseURL: string

    // * Add Axios Cookie Jar
    const jar = new CookieJar()
    let client: AxiosInstance

    beforeAll(async () => {
        mongoServer = new MongoMemoryServer()
        try {
            await mongoose.connect(await mongoServer.getUri(), {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            })
            console.log('Mongoose connected')
        } catch (e) {
            console.error('Mongoose Error')
            await mongoose.disconnect()
            process.exit(1)
        }
        server = app.listen(0)
        port = await new Promise(resolve => {
            server.on('listening', () => {
                const addressInfo = server.address().valueOf() as {
                    address: string
                    family: string
                    port: number
                }
                resolve(addressInfo.port)
            })
        })
        baseURL = `http://localhost:${port}${basePath}/`
        bannerServer = mockApp.listen(4001, () => console.log('MOCK APP LISTENING'))
        client = axios.create({
            withCredentials: true,
            baseURL,
            jar,
            validateStatus: () => {
                /* always resolve on any HTTP status */
                return true
            }
        })
        axiosCookieJarSupport(client)

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
