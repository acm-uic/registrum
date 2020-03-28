import dotenv from 'dotenv'
import axios from 'axios'
import User from '../routes/models/User'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import app, { mongoose, redisClient } from '../app'

dotenv.config()
const PORT = process.env.PORT || 8080
const BASE_PATH = process.env.BASE_PATH || '/api'
const URL = `http://localhost:${PORT}${BASE_PATH}/auth/`

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

describe('Authentication Tests', () => {
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

    describe('Sanity Tests', () => {
        it('Register an account', async () => {
            const response = await client.post('signup', {
                firstname: 'Clark',
                lastname: 'Chen',
                email: 'schen237@uic.edu',
                password: 'theRealClark1$'
            })

            expect(response.status).toBe(200)
        })

        it('Register duplicate account', async () => {
            const response = await client.post('signup', {
                firstname: 'Clark',
                lastname: 'Chen',
                email: 'schen237@uic.edu',
                password: 'theRealClark1$'
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Email already exists!')
        })

        // ! xit indicates test case is pending and not written yet, remember to change to it
        // ! Google login strategy cannot be tested because it requires authentication from google side
        it('Logs user in correctly using email, password', async () => {
            const response = await client.post('login', {
                email: 'schen237@uic.edu',
                password: 'theRealClark1$'
            })

            expect(response.status).toBe(200)
        })

        it('Access restricted resource only available to logged in user', async () => {
            const response = await client.get('')

            expect(response.status).toBe(200)
        })

        it('Logs user out correctly', async () => {
            const response = await client.get('logout')

            expect(response.status).toBe(200)
            if (response.status != 200) {
                console.error(response.data)
            }
        })

        it('Cannot login with incorrect email', async () => {
            const response = await client.post('login', {
                email: 'schen237@acm.cs.uic.edu',
                password: 'theRealClark1$'
            })

            expect(response.status).toBe(401)
        })

        it('Cannot login with incorrect password', async () => {
            const response = await client.post('login', {
                email: 'schen237@uic.edu',
                password: 'theFakeClark1$'
            })

            expect(response.status).toBe(401)
        })

        it('Logs user in using Google', async () => {
            const response = await client.post('loginGoogle', {})

            expect(response.status).toBe(501) // TODO
        })

        // Test Input Validation
        it('Register with invalid firstname', async () => {
            const response = await client.post('signup', {
                firstname: 'Clark1',
                lastname: 'Chen',
                email: 'schen237@uic.edu',
                password: 'theRealClark1$'
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe("Name is invalid")
        })
        
        it('Register with invalid lastname', async () => {
            const response = await client.post('signup', {
                firstname: 'Clark',
                lastname: 'Chen1',
                email: 'schen237@uic.edu',
                password: 'theRealClark1$'
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe("Name is invalid")
        })
        
        it('Register with invalid email', async () => {
            const response = await client.post('signup', {
                firstname: 'Clark',
                lastname: 'Chen',
                email: 'schen237uic.edu',
                password: 'theRealClark1$'
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe("Email is invalid")
        })
        
        it('Register with invalid password', async () => {
            const response = await client.post('signup', {
                firstname: 'Clark',
                lastname: 'Chen',
                email: 'schen237@uic.edu',
                password: 'theRealClark'
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe("Password is not strong enough")
        })
    })

    describe('Edge Case tests', () => {
        it('Error with status code 401 when attempting to logout when not logged in', async () => {
            const response = await axios({
                method: 'GET',
                url: `http://localhost:${PORT}${BASE_PATH}/auth/logout`,
                validateStatus: function(status) {
                    return true
                }
            })

            expect(response.status).toBe(401)
        })
    })
})
