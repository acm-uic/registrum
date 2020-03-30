import dotenv from 'dotenv'
import axios from 'axios'
import User from '../routes/models/User'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import app, { mongoose, redisClient } from '../app'
import { response } from 'express'

dotenv.config()
const PORT = process.env.PORT || 8080
const BASE_PATH = process.env.BASE_PATH || '/api'
const URL = `http://localhost:${PORT}${BASE_PATH}/auth/`

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
    let server = beforeAll(async () => {
        await new Promise((resolve, reject) => {
            server = app.listen(PORT, resolve)
        })
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
        await server.close()
    })

    describe('Sanity Tests', () => {
        // To allow changing info during test case
        let userEmail = 'schen237@uic.edu'
        let userPassword = 'theRealClark1$'

        it('Register an account', async () => {
            const response = await client.post('signup', {
                firstname: 'Clark',
                lastname: 'Chen',
                email: userEmail,
                password: userPassword
            })

            expect(response.status).toBe(200)
        })

        it('Register duplicate account', async () => {
            const response = await client.post('signup', {
                firstname: 'Clark',
                lastname: 'Chen',
                email: userEmail,
                password: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Email already exists!')
        })

        // ! xit indicates test case is pending and not written yet, remember to change to it
        // ! Google login strategy cannot be tested because it requires authentication from google side
        it('Logs user in correctly using email, password', async () => {
            const response = await client.post('login', {
                email: userEmail,
                password: userPassword
            })

            expect(response.status).toBe(200)
        })

        it('Access restricted resource only available to logged in user', async () => {
            const response = await client.get('')

            expect(response.status).toBe(200)
        })

        // Update user Info
        it('Update user info with valid new password', async () => {
            const newUserPassword = 'theRealClark2$'
            const response = await client.post('update', {
                password: newUserPassword,
                userPassword: userPassword
            })
            userPassword = newUserPassword
            expect(response.status).toBe(200)
            expect(response.data).toBe('OK')
        })

        it('Update user info with valid new lastname', async () => {
            const response = await client.post('update', {
                lastname: 'Kent',
                userPassword: userPassword
            })

            expect(response.status).toBe(200)
            expect(response.data).toBe('OK')
        })

        it('Update user info with valid new firstname', async () => {
            const response = await client.post('update', {
                firstname: 'Clarke',
                userPassword: userPassword
            })

            expect(response.status).toBe(200)
            expect(response.data).toBe('OK')
        })

        it('Update user info with valid new email', async () => {
            const newUserEmail = 'clark@clark-chen.com'
            const response = await client.post('update', {
                email: newUserEmail,
                userPassword: userPassword
            })
            userEmail = newUserEmail
            expect(response.status).toBe(200)
            expect(response.data).toBe('OK')
        })

        // Input Validation for update user info
        it('Update user info with invalid old password', async () => {
            const response = await client.post('update', {
                password: 'theRealClark',
                userPassword: userPassword + 'fake'
            })

            expect(response.status).toBe(401)
            expect(response.data).toBe('Password not valid')
        })

        it('Update user info with invalid new password', async () => {
            const response = await client.post('update', {
                password: 'theRealClark',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Password is not strong enough')
        })

        it('Update user info with invalid new lastname', async () => {
            const response = await client.post('update', {
                lastname: 'Kent?',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Last name is invalid')
        })

        it('Update user info with invalid new firstname', async () => {
            const response = await client.post('update', {
                firstname: 'Clark?',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('First name is invalid')
        })

        it('Update user info with invalid new email', async () => {
            const response = await client.post('update', {
                email: 'clarkclark-chen.com',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Email is invalid')
        })

        it('Update user info with missing userPassword', async () => {
            const response = await client.post('update', {})

            expect(response.status).toBe(401)
            expect(response.data).toBe('Password not provided')
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
                email: userEmail + '.fake',
                password: 'theRealClark1$'
            })

            expect(response.status).toBe(401)
        })

        it('Cannot login with incorrect password', async () => {
            const response = await client.post('login', {
                email: userEmail,
                password: 'theFakeClark1$'
            })

            expect(response.status).toBe(401)
        })

        it('Logs user in using Google', async () => {
            const response = await client.post('loginGoogle', {})

            expect(response.status).toBe(501) // TODO
        })

        // Input Validation for Register
        it('Register with invalid firstname', async () => {
            const response = await client.post('signup', {
                firstname: 'Clark1',
                lastname: 'Chen',
                email: 'schen237@uic.edu',
                password: 'theRealClark1$'
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Name is invalid')
        })

        it('Register with invalid lastname', async () => {
            const response = await client.post('signup', {
                firstname: 'Clark',
                lastname: 'Chen1',
                email: 'schen237@uic.edu',
                password: 'theRealClark1$'
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Name is invalid')
        })

        it('Register with invalid email', async () => {
            const response = await client.post('signup', {
                firstname: 'Clark',
                lastname: 'Chen',
                email: 'schen237uic.edu',
                password: 'theRealClark1$'
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Email is invalid')
        })

        it('Register with invalid password', async () => {
            const response = await client.post('signup', {
                firstname: 'Clark',
                lastname: 'Chen',
                email: 'schen237@uic.edu',
                password: 'theRealClark'
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Password is not strong enough')
        })

        it('Can update user correctly', async () => {
            // * Signup
            await client.post('signup', {
                firstname: 'Bharat',
                lastname: 'Middha',
                email: 'achomi2@uic.edu',
                password: 'oldPassword1$'
            })

            // * Try to post updates
            await client.post('update', {
                firstname: 'Alex',
                lastname: 'Chomiak',
                password: 'theRealAlex1$',
                userPassword: 'oldPassword1$'
            })

            // * Logout
            await client.post('logout')

            // * Log back in with new password
            const response = await client.post('/login', {
                email: 'achomi2@uic.edu',
                password: 'theRealAlex1$'
            })

            // * Assure status is 200
            expect(response.status).toBe(200)

            // * Check user is updated
            const { data: user } = await client.get('/')

            // * Check against new first and last names
            expect(user.firstname).toBe('Alex')
            expect(user.lastname).toBe('Chomiak')
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
