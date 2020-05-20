import axios, { AxiosInstance } from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import { App } from '../app'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Server } from 'http'

describe('Authentication Tests', () => {
    // * ENV variables
    const basePath = process.env.API_BASE_PATH || '/api'

    const port = 8085
    const baseURL = `http://localhost:${port}${basePath}/auth`

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
    })

    describe('Sanity Tests', () => {
        // * To allow changing info during test case
        let userEmail = 'registrum@example.com'
        let userPassword = 'theRealApp1$'

        // * Sign up
        it('Register an account', async () => {
            const response = await client.post('/signup', {
                firstname: 'John',
                lastname: 'Smith',
                email: userEmail,
                password: userPassword
            })

            expect(response.status).toBe(200)
            expect(response.data.firstname).toBe('John')
            expect(response.data.lastname).toBe('Smith')
            expect(response.data.email).toBe(userEmail)
        })

        // Attempting to register a duplicate account
        it('Register duplicate account', async () => {
            const response = await client.post('/signup', {
                firstname: 'John',
                lastname: 'Smith',
                email: userEmail,
                password: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Email already exists!')
        })

        it('Logs user in correctly using email, password', async () => {
            const response = await client.post('/login', {
                email: userEmail,
                password: userPassword
            })

            expect(response.status).toBe(200)
            expect(response.data.email).toBe(userEmail)
        })

        // Test Login status by accessing restricted page
        it('Access restricted resource only available to logged in user', async () => {
            const response = await client.get('/')

            expect(response.status).toBe(200)
        })

        //// Update user Info
        // Valid input for changing password
        it('Update user info with valid new password', async () => {
            const newUserPassword = 'theRealApp2$'
            const response = await client.post('/update', {
                password: newUserPassword,
                userPassword: userPassword
            })
            userPassword = newUserPassword
            expect(response.status).toBe(200)

            expect(response.data.email).toBe(userEmail)

            // Login with new password
            const retryLoginResponse = await client.post('/login', {
                email: userEmail,
                password: userPassword
            })
            expect(retryLoginResponse.status).toBe(200)
            expect(retryLoginResponse.data.email).toBe(userEmail)
        })

        // Valid input for changing last name
        it('Update user info with valid new lastname', async () => {
            const response = await client.post('/update', {
                lastname: 'Doe',
                userPassword: userPassword
            })

            expect(response.status).toBe(200)

            expect(response.data.lastname).toBe('Doe')
        })

        // Valid input for changing first name
        it('Update user info with valid new firstname', async () => {
            const response = await client.post('/update', {
                firstname: 'Dough',
                userPassword: userPassword
            })

            expect(response.status).toBe(200)
            expect(response.data.firstname).toBe('Dough')
        })

        // Valid input for changing email
        it('Update user info with valid new email', async () => {
            const newUserEmail = 'registrum2@example.com'
            const response = await client.post('/update', {
                email: newUserEmail,
                userPassword: userPassword
            })

            userEmail = newUserEmail
            expect(response.status).toBe(200)
            expect(response.data.email).toBe('registrum2@example.com')
        })

        // Attempting to change password with wrong current password
        it('Update user info with invalid old password', async () => {
            const response = await client.post('/update', {
                password: 'password_is_fake',
                userPassword: userPassword + 'fake'
            })

            expect(response.status).toBe(401)
            expect(response.data).toBe('Password not valid')
        })

        // Attempting to change password with invalid new password
        it('Update user info with invalid new password', async () => {
            const response = await client.post('/update', {
                password: 'theRealApp',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Password is not strong enough')
        })

        // Attempting to change lastname with invalid new lastname
        it('Update user info with invalid new lastname', async () => {
            const response = await client.post('/update', {
                lastname: 'Doe?',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Last name is invalid')
        })

        // Attempting to change firstname with invalid new firstname
        it('Update user info with invalid new firstname', async () => {
            const response = await client.post('/update', {
                firstname: 'John?',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('First name is invalid')
        })

        // Attempting to change email with invalid new email
        it('Update user info with invalid new email', async () => {
            const response = await client.post('/update', {
                email: 'registrum-example.com',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Email is invalid')
        })

        // Attempting to change info without old password(userPassword) provided
        it('Update user info with missing userPassword', async () => {
            const response = await client.post('/update', {})

            expect(response.status).toBe(401)
            expect(response.data).toBe('Password not provided')
        })

        // Attempting to change user ID
        it('Update user info id (Security Violation)', async () => {
            const response = await client.post('/update', {
                _id: '000000000000000000000000',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Info update input violation')
        })

        // Attempting to change subscriptions
        it('Update subscriptions using user info API', async () => {
            const response = await client.post('/update', {
                subscriptions: '{}',
                userPassword: userPassword
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Info update input violation')
        })

        // Check if logout is working
        it('Logs user out correctly', async () => {
            const response = await client.get('/logout')

            expect(response.status).toBe(200)
            expect(response.data).toBe('OK')
        })

        // Attempting to login with incorrect email
        it('Cannot login with incorrect email', async () => {
            const response = await client.post('/login', {
                email: userEmail + '.fake',
                password: userPassword
            })

            expect(response.status).toBe(401)
            expect(response.data).toBe('Unauthorized')
        })

        // Attempting to login with incorrect password
        it('Cannot login with incorrect password', async () => {
            const response = await client.post('/login', {
                email: userEmail,
                password: 'theFakeApp1$'
            })

            expect(response.status).toBe(401)
            expect(response.data).toBe('Unauthorized')
        })

        // Attempting to register with invalid firstname
        it('Register with invalid firstname', async () => {
            const response = await client.post('/signup', {
                firstname: 'John1',
                lastname: 'Doe',
                email: 'registrum@example.com',
                password: 'theRealApp1$'
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Name is invalid')
        })

        // Attempting to register with invalid lastname
        it('Register with invalid lastname', async () => {
            const response = await client.post('/signup', {
                firstname: 'John',
                lastname: 'Doe1',
                email: 'registrum@example.com',
                password: 'theRealApp1$'
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Name is invalid')
        })

        // Attempting to register with invalid email
        it('Register with invalid email', async () => {
            const response = await client.post('/signup', {
                firstname: 'John',
                lastname: 'Doe',
                email: 'registrum-example.com',
                password: 'theRealApp1$'
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Email is invalid')
        })

        // Attempting to register with invalid password
        it('Register with invalid password', async () => {
            const response = await client.post('/signup', {
                firstname: 'John',
                lastname: 'Doe',
                email: 'registrum@example.com',
                password: 'theRealApp'
            })

            expect(response.status).toBe(400)
            expect(response.data).toBe('Password is not strong enough')
        })

        // Run through a sequence of Change user info process
        it('Can update user correctly', async () => {
            // * Sign up
            await client.post('/signup', {
                firstname: 'Jimmy',
                lastname: 'Falcon',
                email: 'jimmy@example.com',
                password: 'jimmyPass#1'
            })

            // * Try to post updates
            await client.post('/update', {
                firstname: 'Tom',
                lastname: 'Bald',
                password: 'jimmyPass#2',
                userPassword: 'jimmyPass#1'
            })

            // * Logout
            await client.post('/logout')

            // * Log back in with new password
            const response = await client.post('/login', {
                email: 'jimmy@example.com',
                password: 'jimmyPass#2'
            })

            // * Assure status is 200
            expect(response.status).toBe(200)

            // * Check user is updated
            const { data: user } = await client.get('/')

            // * Check against new first and last names
            expect(user.firstname).toBe('Tom')
            expect(user.lastname).toBe('Bald')
        })
    })

    describe('Edge Case tests', () => {
        // Attempting to logout while not login
        it('Error with status code 401 when attempting to logout when not logged in', async () => {
            const response = await axios({
                method: 'GET',
                url: `http://localhost:${port}${basePath}/auth/logout`,
                validateStatus: function () {
                    return true
                }
            })

            expect(response.status).toBe(401)
        })
    })
})
