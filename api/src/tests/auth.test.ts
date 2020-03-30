import dotenv from 'dotenv'
import axios from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import app, { mongoose, redisClient } from '../app'

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

        // Signup
        it('Register an account', async () => {
            const response = await client.post('signup', {
                firstname: 'Clark',
                lastname: 'Chen',
                email: userEmail,
                password: userPassword
            })

            expect(response.status).toBe(200)
            expect(response.data.firstname).toBe('Clark')
            expect(response.data.lastname).toBe('Chen')
            expect(response.data.email).toBe(userEmail)
        })

        // Attempting to register a duplicate account
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
            expect(response.data.email).toBe(userEmail)
        })

        // Test Login status by accessing restricted page
        it('Access restricted resource only available to logged in user', async () => {
            const response = await client.get('')

            expect(response.status).toBe(200)
        })

        //// Update user Info
        // Valid input for changing password
        it('Update user info with valid new password', async () => {
            const newUserPassword = 'theRealClark2$'
            const response = await client.post('update', {
                password: newUserPassword,
                userPassword: userPassword
            })
            userPassword = newUserPassword
            expect(response.status).toBe(200)
            expect(response.data.email).toBe(userEmail)

            // Login with new password
            const retryLoginResponse = await client.post('login', {
                email: userEmail,
                password: userPassword
            })
            expect(retryLoginResponse.status).toBe(200)
            expect(retryLoginResponse.data.email).toBe(userEmail)
        })

        // Valid input for changing lastname
        it('Update user info with valid new lastname', async () => {
            const response = await client.post('update', {
                lastname: 'Kent',
                userPassword: userPassword
            })

            expect(response.status).toBe(200)
            expect(response.data.lastname).toBe('Kent')
        })

        // Valid input for changing firstname
        it('Update user info with valid new firstname', async () => {
            const response = await client.post('update', {
                firstname: 'Clarke',
                userPassword: userPassword
            })

            expect(response.status).toBe(200)
            expect(response.data.firstname).toBe('Clarke')
        })

        // Valid input for changing email
        it('Update user info with valid new email', async () => {
            const newUserEmail = 'clark@clark-chen.com'
            const response = await client.post('update', {
                email: newUserEmail,
                userPassword: userPassword
            })
            userEmail = newUserEmail
            expect(response.status).toBe(200)
            expect(response.data.email).toBe('clark@clark-chen.com')
        })

        // Attempting to change password with wrong current password
        it('Update user info with invalid old password', async () => {
            const response = await client.post('update', {
                password: 'theRealClark',
                userPassword: userPassword + 'fake'
            })

            expect(response.status).toBe(401)
            expect(response.data).toBe('Password not valid')
        })

        // Attempting to change password with invalid new password
        it('Update user info with invalid new password', async () => {
            const response = await client.post('update', {
                password: 'theRealClark',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Password is not strong enough')
        })

        // Attempting to change lastname with invalid new lastname
        it('Update user info with invalid new lastname', async () => {
            const response = await client.post('update', {
                lastname: 'Kent?',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Last name is invalid')
        })

        // Attempting to change firstname with invalid new firstname
        it('Update user info with invalid new firstname', async () => {
            const response = await client.post('update', {
                firstname: 'Clark?',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('First name is invalid')
        })

        // Attempting to change email with invalid new email
        it('Update user info with invalid new email', async () => {
            const response = await client.post('update', {
                email: 'clarkclark-chen.com',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Email is invalid')
        })

        // Attempting to change info without old password(userPassword) provided
        it('Update user info with missing userPassword', async () => {
            const response = await client.post('update', {})

            expect(response.status).toBe(401)
            expect(response.data).toBe('Password not provided')
        })

        // Attempting to change user ID
        it("Update user info's id (Security Violation)", async () => {
            const response = await client.post('update', {
                _id: '000000000000000000000000',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Info update input violation')
        })

        // Attempting to change subscriptions
        it('Update subscriptions using userinfo API', async () => {
            const response = await client.post('update', {
                subscriptions: '{}',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Info update input violation')
        })

        // Check if logout is working
        it('Logs user out correctly', async () => {
            const response = await client.get('logout')

            expect(response.status).toBe(200)
            expect(response.data).toBe('OK')
        })

        // Attempting to login with incorrect email
        it('Cannot login with incorrect email', async () => {
            const response = await client.post('login', {
                email: userEmail + '.fake',
                password: userPassword
            })

            expect(response.status).toBe(401)
            expect(response.data).toBe('Unauthorized')
        })

        // Attempting to login with incorrect password
        it('Cannot login with incorrect password', async () => {
            const response = await client.post('login', {
                email: userEmail,
                password: 'theFakeClark1$'
            })

            expect(response.status).toBe(401)
            expect(response.data).toBe('Unauthorized')
        })

        // Test login with Google (TODO)
        it('Logs user in using Google', async () => {
            const response = await client.post('loginGoogle', {})

            expect(response.status).toBe(501) // TODO
            expect(response.data).toBe('TODO')
        })

        // Attempting to register with invalid firstname
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

        // Attempting to register with invalid lastname
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

        // Attempting to register with invalid email
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

        // Attempting to register with invalid password
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

        // Run through a sequence of Change user info process
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
        // Attempting to logout while not login
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
