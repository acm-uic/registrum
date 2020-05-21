import axios, { AxiosInstance } from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { App } from '../App'
import mongoose from 'mongoose'
import { Server } from 'http'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mockApp from './mockbanner'

describe('Class Tests', () => {
    const mongoServer: MongoMemoryServer = new MongoMemoryServer()
    const basePath = '/api'

    // * Initialize
    let port: number
    let baseURL: string
    let mongoUri: string
    let expressApp: App
    let server: Server
    let client: AxiosInstance
    let bannerServer: Server
    let bannerPort: number

    beforeAll(async () => {
        mongoUri = await mongoServer.getUri()

        // * Start listening on available port
        bannerServer = mockApp.listen(0, () => console.log('MOCK APP LISTENING'))
        // * Find banner port
        bannerPort = await new Promise(resolve => {
            bannerServer.on('listening', () => {
                const addressInfo = bannerServer.address().valueOf() as {
                    address: string
                    family: string
                    port: number
                }
                resolve(addressInfo.port)
            })
        })

        // * Wait for app to initialize
        await new Promise(resolve => {
            // * Create the app with the configurations
            expressApp = new App(
                {
                    port,
                    basePath,
                    mongoUri,
                    serviceName: 'API',
                    bannerUrl: `http://localhost:${bannerPort}/banner`,
                    apiHost: ''
                },
                resolve
            )
        })

        // * Start listening on available port
        server = expressApp.listen(0)

        // * Find app port
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

        // * Create axios client
        client = axios.create({
            withCredentials: true,
            baseURL,
            jar: new CookieJar(),
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
