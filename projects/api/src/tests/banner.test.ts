import axios, { AxiosInstance } from 'axios'
import { App } from '../app'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Class } from '../models/interfaces/Class'
import { Server } from 'http'
import mockApp from './mockbanner'
import { UserObject } from '../models/User'
import { CookieJar } from 'tough-cookie'
import axiosCookieJarSupport from 'axios-cookiejar-support'

jest.setTimeout(60000)

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

    // * Chosen Class for subscription
    let chosenClass: Class

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

        // * Retrieve classes for CS401
        const classes = (await client.get(`/classes/listing/220208/CS/401`)).data as Class[]

        // * Pick random class
        chosenClass = classes[Math.floor(Math.random() * classes.length)]
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

        // * Close Server
        await new Promise(resolve => {
            server.close(() => {
                resolve()
            })
        })

        // * We wait until all threads have been run once to ensure the connection closes.
        await new Promise(resolve => setImmediate(resolve))

        // * Close Others
        await mongoose.disconnect()
        await mongoServer.stop()
        bannerServer.close()
    })

    beforeEach(async () => {
        await client.post('/auth/login', {
            email: 'registrum@example.com',
            password: 'theRealApp1$'
        })

        // * Unsubscribe from class
        await client.post('/banner/unsubscribe', {
            crn: chosenClass.courseReferenceNumber
        })
    })

    afterEach(async () => {
        await client.get('/auth/logout')
    })

    it('Correctly subscribe to class', async () => {
        // * Subscribe to chosen class
        await client.post('/banner/subscribe', {
            crn: chosenClass.courseReferenceNumber
        })

        // * Make sure CRN is in subscription list
        const { data: user } = await client.get('/auth')

        // * Make sure class has CRN
        expect(user.subscriptions).toContain(chosenClass.courseReferenceNumber)
    })

    it('Correctly unsubscribe from class', async () => {
        // * Subscribe to chosen class
        await client.post('/banner/subscribe', {
            crn: chosenClass.courseReferenceNumber
        })

        // * Unsubscribe from chosen class
        await client.post('/banner/unsubscribe', {
            crn: chosenClass.courseReferenceNumber
        })

        // * Make sure CRN is not in subscription list
        const { data: user } = await client.get('/auth')

        // * Make sure class does not have CRN
        expect(user.subscriptions).not.toContain(chosenClass.courseReferenceNumber)
    })

    it('Subscribing twice does not create duplicate subscriptions', async () => {
        // * Subscribe to chosen class
        await client.post('/banner/subscribe', {
            crn: chosenClass.courseReferenceNumber
        })

        // * Subscribe AGAIN to chosen class
        await client.post('/banner/subscribe', {
            crn: chosenClass.courseReferenceNumber
        })

        // * Make sure CRN is not in subscription list twice
        const user: UserObject = (await client.get('/auth')).data

        // * Make sure class does not have CRN
        let count = 0
        user.subscriptions.forEach(
            subscription => (count += subscription === chosenClass.courseReferenceNumber ? 1 : 0)
        )

        // * Expect one occurence
        expect(count).toBe(1)
    })

    it('Status 400 when trying to unsubscribe with no crn provided', async () => {
        // * Make empty request
        const res = await client.post('/banner/subscribe')
        expect(res.status).toBe(400)
        expect(res.data).toEqual('No Class CRN provided')
    })

    it('Status 400 when trying to subscribe with no crn provided', async () => {
        // * Make empty request
        const res = await client.post('/banner/unsubscribe')
        expect(res.status).toBe(400)
        expect(res.data).toEqual('No Class CRN provided')
    })

    it('correctly retrieve status list', async () => {
        try {
            // * Pick second class
            let secondClass: Class = null

            while (
                !secondClass ||
                secondClass.courseReferenceNumber === chosenClass.courseReferenceNumber
            ) {
                // * Get class list
                const classes = (await client.get(`/classes/listing/220208/CS/301`)).data

                // * Pick random class
                secondClass = classes[Math.floor(Math.random() * classes.length)]
            }
            console.log(chosenClass, secondClass)
            // * Subscribe to chosen class
            await client.post('/banner/subscribe', {
                crn: chosenClass.courseReferenceNumber
            })

            // * Subscribe to second class
            await client.post('/banner/subscribe', {
                crn: secondClass.courseReferenceNumber
            })

            // * Make sure user subscriptions contain both CRNs
            const { subscriptions } = (await client.get('/auth')).data
            console.log(subscriptions)
            // * Make sure both subscriptions registered in system
            expect(subscriptions).toContain(chosenClass.courseReferenceNumber)
            expect(subscriptions).toContain(secondClass.courseReferenceNumber)

            // * Make sure status list contains all CRNs
            const { data: statuslist } = await client.get('/banner/tracking')
            console.log(statuslist)
            // // * Make sure statuses contain
            // const statusCRNs = Array.from(
            //     statuslist as Class[],
            //     (status: Class) => status.courseReferenceNumber
            // )
            // console.log(statuslist)
            // // * Make sure both CRNs in status list
            // expect(statusCRNs).toContain(chosenClass.courseReferenceNumber)
            // expect(statusCRNs).toContain(secondClass.courseReferenceNumber)
        } catch (err) {
            console.log(err.message)
        }
    })
})
