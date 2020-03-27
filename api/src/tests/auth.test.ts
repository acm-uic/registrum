import dotenv from 'dotenv'
import axios from 'axios'
import User from '../routes/models/User'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import general from '../app'

dotenv.config()
const app = general
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
    describe('Sanity Tests', () => {
        afterAll(async () => {
            //Remove all users from DB
            await User.deleteMany({}).then(() => {
                console.log('Clear up done')
            })
        })

        it('Register an account', async () => {
            const response = await client.post('signup', {
                firstname: 'Clark',
                lastname: 'Chen',
                email: 'schen237@uic.edu',
                password: 'theRealClark1$'
            })

            expect(response.status).toBe(200)
            if (response.status != 200) {
                console.log(response.data)
            }
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
            if (response.status != 400) {
                console.log(response.data)
            }
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
            if (response.status != 401) {
                console.log(response.data)
            }
        })
    })
})
