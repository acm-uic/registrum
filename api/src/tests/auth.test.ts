import dotenv from 'dotenv'
import axios from 'axios'
import User, { UserObject } from '../routes/models/User'
import general from '../app'
import { STATES } from 'mongoose'

dotenv.config()
const app = general
const PORT = process.env.PORT || 8080
const URL = `http://localhost:${PORT}/auth/`

const server = app.listen(PORT)

describe('Authentication Tests', () => {
    let cookie = ''
    const client = axios.create({
        baseURL: URL,
        validateStatus: () => {
            /* always resolve on any HTTP status */
            return true
        }
    })
    describe('Sanity Tests', () => {
        it('Register an account', async () => {
            await client
                .post('signup', {
                    firstname: 'Clark',
                    lastname: 'Chen',
                    email: 'schen237@uic.edu',
                    password: 'theRealClark'
                })
                .then(response => {
                    expect(response.status).toBe(200)
                    if (response.status != 200) {
                        console.log(response.data)
                    }
                })
        })
        afterAll(async () => {
            //Remove user from DB
            await User.remove({}).then(() => {
                console.log('Clear up done')
            })
        })
        // ! xit indicates test case is pending and not written yet, remember to change to it
        // ! Google login strategy cannot be tested because it requires authentication from google side
        it('Logs user in correctly using email, password', async () => {
            await client
                .post('login', {
                    email: 'schen237@uic.edu',
                    password: 'theRealClark'
                })
                .then(response => {
                    cookie = String(response.headers['set-cookie'])
                    expect(response.status).toBe(200)
                })
        })
        it('Logs user out correctly', async () => {
            await client
                .get('logout', {
                    headers: {
                        Cookie: cookie
                    }
                })
                .then(response => {
                    expect(response.status).toBe(200)
                    if (response.status != 200) {
                        console.log(response.data)
                    }
                })
        })
        it('Cannot login with incorrect email', async () => {
            await client
                .post('login', {
                    email: 'schen237@acm.cs.uic.edu',
                    password: 'theRealClark'
                })
                .then(response => {
                    expect(response.status).toBe(401)
                })
        })
        it('Cannot login with incorrect password', async () => {
            await client
                .post('login', {
                    email: 'schen237@uic.edu',
                    password: 'theFakeClark'
                })
                .then(response => {
                    expect(response.status).toBe(401)
                })
        })
    })

    describe('Edge Case tests', () => {
        const client = axios.create({
            baseURL: URL,
            validateStatus: () => {
                /* always resolve on any HTTP status */
                return true
            }
        })
        it('Error with status code 401 when attempting to logout when not logged in', async () => {
            await client.get('logout').then(response => {
                expect(response.status).toBe(401)
                if (response.status != 401) {
                    console.log(response.data)
                }
            })
        })
    })
})
