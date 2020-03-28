import dotenv from 'dotenv'
import axios from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import User from '../routes/models/User'
import app, { mongoose, redisClient } from '../app'
import { response } from 'express'

import { Class } from '../routes/models/interfaces/Class'
import { Status } from '../routes/models/interfaces/Status'

dotenv.config()
const PORT = process.env.PORT || 8081
const BASE_PATH = process.env.BASE_PATH || '/api'
const URL = `http://localhost:${PORT}${BASE_PATH}/`

const server = app.listen(PORT)

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

describe('Class Tests', () => {
    afterAll(async () => {
        // * Remove all users from DB
        await new Promise((resolve, reject) => {
            mongoose.connection.db.dropCollection('users', function(err, result) {
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
        await server.close()
    })

    // * Chosen term
    let term = ''
    // * Subjects
    let subjects = []

    // * Chosen Class for subscription
    let chosenClass: Class = null

    beforeAll(async () => {
        const response = await client.post(`auth/signup`, {
            firstname: 'Clark',
            lastname: 'Chen',
            email: 'schen237@uic.edu',
            password: 'theRealClark1$'
        })

        expect(response.status).toBe(200)

        // * Populate terms
        const terms = (await client.get('/classes/terms')).data

        // * Pick random term
        term = terms[Math.floor(Math.random() * terms.length)]

        // * Populate Subject list for random term
        subjects = (await client.get(`/classes/subjects/${term}`)).data

        // * Pick random subject
        const subject = subjects[Math.floor(Math.random() * subjects.length)]

        // * Retieve classes for random class
        const classes = (await client.get(`/classes/list/${subject}`)).data as Class[]

        // * Pick random class
        chosenClass = classes[Math.floor(Math.random() * classes.length)]
    })

    beforeEach(async () => {
        await client.post('auth/login', {
            email: 'schen237@uic.edu',
            password: 'theRealClark1$'
        })

        // * Unsubscribe from class
        await client.post('/banner/unsubscribe', {
            crn: chosenClass.crn
        })
    })

    afterEach(async () => {
        await client.get('/auth/logout')
    })

    it('Correctly subscribe to class', async () => {
        // * Subscribe to chosen class
        await client.post('/banner/subscribe', {
            crn: chosenClass.crn
        })

        // * Make sure CRN is in subscription list
        const { data: user } = await client.get('/auth')

        // * Make sure class has CRN
        expect(user.subscriptions).toContain(chosenClass.crn)
    })

    it('Correctly unsubscribe from class', async () => {
        // * Subscribe to chosen class
        await client.post('/banner/subscribe', {
            crn: chosenClass.crn
        })

        // * Unsubscribe from chosen class
        await client.post('/banner/unsubscribe', {
            crn: chosenClass.crn
        })

        // * Make sure CRN is not in subscription list
        const { data: user } = await client.get('/auth')

        // * Make sure class does not have CRN
        expect(user.subscriptions).not.toContain(chosenClass.crn)
    })

    it('Subscribing twice does not create duplicate subscriptions', async () => {
        // * Subscribe to chosen class
        await client.post('/banner/subscribe', {
            crn: chosenClass.crn
        })

        // * Subscribe AGAIN to chosen class
        await client.post('/banner/subscribe', {
            crn: chosenClass.crn
        })

        // * Make sure CRN is not in subscription list twice
        const { data: user } = await client.get('/auth')

        // * Make sure class does not have CRN
        let count = 0
        user.subscriptions.forEach(
            subscription => (count += subscription === chosenClass.crn ? 1 : 0)
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
        // * Pick second class
        let secondClass: Class = null

        while (!secondClass || secondClass.crn === chosenClass.crn) {
            // * Pick subject
            const subject = subjects[Math.floor(Math.random() * subjects.length)]

            // * Get class list
            const classes = (await client.get(`/classes/list/${subject}`)).data

            // * Pick random class
            secondClass = classes[Math.floor(Math.random() * classes.length)]
        }

        // * Subscribe to chosen class
        await client.post('/banner/subscribe', {
            crn: chosenClass.crn
        })

        // * Subscribe to second class
        await client.post('/banner/subscribe', {
            crn: secondClass.crn
        })

        // * Make sure user subscribptions contain both CRNs
        const { subscriptions } = (await client.get('/auth')).data

        // * Make sure both subscriptions registered in system
        expect(subscriptions).toContain(chosenClass.crn)
        expect(subscriptions).toContain(secondClass.crn)

        // * Make sure status list contains all CRNs
        const { data: statuslist } = await client.get('/banner/statuses')

        // * Make sure statuses contain
        const statusCRNs = Array.from(statuslist as Status[], (status: Status) => status.crn)

        // * Make sure both CRNs in status list
        expect(statusCRNs).toContain(chosenClass.crn)
        expect(statusCRNs).toContain(secondClass.crn)
    })
})
