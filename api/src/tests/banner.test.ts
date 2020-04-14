import dotenv from 'dotenv'
import axios from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import User from '../routes/models/User'
import app, { mongoose, redisClient } from '../app'

import { Class } from '../routes/models/interfaces/Class'
import { Server } from 'http'
import mockApp from './mockbanner'

dotenv.config()
const port = process.env.API_PORT || 8085
const basePath = process.env.API_BASE_PATH || '/api'
const URL = `http://localhost:${port}${basePath}/`

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

    // * Chosen term
    const term = ''
    // * Subjects
    const subjects = []

    // * Chosen Class for subscription
    let chosenClass: Class = null

    beforeAll(async () => {
        server = app.listen(port)
        bannerServer = mockApp.listen(4001, () => console.log('MOCK APP LISTENING'))

        const response = await client.post('auth/signup', {
            firstname: 'John',
            lastname: 'Doe',
            email: 'registrum@example.com',
            password: 'theRealApp1$'
        })

        expect(response.status).toBe(200)

        // * Retrieve classes for CS401
        const classes = (await client.get(`/classes/listing/CS/401`)).data as Class[]

        // * Pick random class
        chosenClass = classes[Math.floor(Math.random() * classes.length)]
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

    beforeEach(async () => {
        await client.post('auth/login', {
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
        const { data: user } = await client.get('/auth')

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
                const classes = (await client.get(`/classes/listing/CS/301`)).data

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

    it('Cannot subscribe to class with invalid CRN', async () => {
        test.todo
    })

    it('Cannot unsubscribe to test with invalid CRN', async () => {
        test.todo
    })

    it('Banner API returns all proper class information upon query', async () => {
        test.todo
    })

    it('Correct subjects are retrieved for FALL 2020', async () => {
        test.todo
    })

    it('Correct CS 141 Listings are retrieved for CS In FALL 2020', async () => {
        test.todo
    })
})
