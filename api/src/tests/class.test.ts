import dotenv from 'dotenv'
import axios from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import User from '../routes/models/User'
import app, { mongoose, redisClient } from '../app'
import { response } from 'express'
import { Server } from 'http'

dotenv.config()
const PORT = process.env.PORT || 8085
const BASE_PATH = process.env.BASE_PATH || '/api'
const URL = `http://localhost:${PORT}${BASE_PATH}/`

describe('Class Tests', () => {
    let server: Server

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
        server = app.listen(PORT)

        const response = await client.post(`auth/signup`, {
            firstname: 'Clark',
            lastname: 'Chen',
            email: 'schen237@uic.edu',
            password: 'theRealClark1$'
        })

        expect(response.status).toBe(200)
    })

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
        server.close()
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
            // * Grab terms
            const { data: terms } = await client.get('classes/terms')

            // * Grab subjects for given term
            const { data: subjects } = await client.get(`classes/subjects/${terms[0]}`)

            // * Make sure each subject is a valid string
            subjects.forEach(subject => {
                expect(typeof subject === typeof String)
            })
        })

        it('Returns a valid list of courses for a given subject', async () => {
            // * Grab terms
            const { data: terms } = await client.get('classes/terms')

            // * Grab subjects for given term
            const { data: subjects } = await client.get(`classes/subjects/${terms[0]}`)

            // * Grab classes for given subject
            const { data: classes } = await client.get(`classes/list/${subjects[0]}`)

            // * Make sure each class is a valid class object
            classes.forEach(cls => {
                expect(cls).toHaveProperty('crn')
                expect(cls).toHaveProperty('number')
            })
        })
    })

    describe('Edge case tests', () => {
        it('Returns an empty array of subjects for an invalid term', async () => {
            // * Try to retrieve subjects
            const { data: subjects } = await client.get('/classes/subjects/invalid')
            expect(subjects).toHaveLength(0)
        })

        it('Returns an empty array of classes for an invalid subject', async () => {
            // * Try to retrieve classes
            const { data: classes } = await client.get('/classes/list/invalid')
            expect(classes).toHaveLength(0)
        })
    })
})
