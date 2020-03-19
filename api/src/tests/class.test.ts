import dotenv from 'dotenv'
import axios from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'
import User from '../routes/models/User'
import app from '../app'
import { response } from 'express'
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
        //Remove user from DB
        await User.deleteMany({}).then(() => {
            console.log('Clear up done')
        })
    })

    let testClass = {
        _id: '',
        subject: 'CS',
        number: 494
    }

    beforeAll(async () => {
        await User.deleteMany({}).then(() => {
            console.log('Clear up done')
        })

        const response = await client.post(`/auth/signup`, {
            firstname: 'Clark',
            lastname: 'Chen',
            email: 'schen2370@uic.edu',
            password: 'theRealClark'
        })

        expect(response.status).toBe(200)
    })

    beforeEach(async () => {
        const response = await client.post('/auth/login', {
            email: 'schen2370@uic.edu',
            password: 'theRealClark'
        })
    })

    it('Correctly add class to user watch list', async () => {
        const response = await client.post('/classes/add', testClass)

        expect(response.status).toBe(200)
        expect(response.data.length).toBe(1)

        expect(response.data[0].subject).toBe('CS')
        expect(response.data[0].number).toBe(494)
        expect(response.data[0]._id).not.toBe('')

        testClass = response.data[0]

        if (response.status != 200) {
            console.debug(response.data)
        }
    })

    it('Missing number field when add class to user watch list', async () => {
        const response = await client.post('/classes/add', {
            number: 494
        })

        expect(response.status).toBe(500)
        expect(response.data).toBe('Missing course subject')
    })

    it('Missing subject field when add class to user watch list', async () => {
        const response = await client.post('/classes/add', {
            subject: 'CS'
        })

        expect(response.status).toBe(500)
        expect(response.data).toBe('Missing course number')
    })

    it('Correctly retrieves classes for given subject', async () => {
        const response = await client.get('/classes/userlist')

        if (response.status != 200) {
            console.debug(response.data)
        }
        expect(response.status).toBe(200)
        expect(response.data.length).toBe(1)

        const idx = response.data.findIndex(
            cls => JSON.stringify(cls) === JSON.stringify(testClass)
        )
        expect(idx).toBeGreaterThan(-1)
    })

    it('Unauthorized retrieves classes for given subject', async () => {
        await client.get('/auth/logout')
        const response = await client.get('/classes/userlist')

        expect(response.status).toBe(401)
        expect(response.data).toBe('Error, Not logged in')
        if (response.status != 401) {
            console.debug(response.data)
        }
    })

    it('Correctly remove class from user watch list', async () => {
        const response = await client.post('/classes/remove', {
            _id: testClass._id
        })

        expect(response.status).toBe(200)
        expect(response.data.length).toBe(0)

        if (response.status != 200) {
            console.error(response.data)
        }
    })

    it('Remove class with invalid classID from user watch list', async () => {
        // * get the original classes so that it could be compared
        await client.post('/classes/add', { subject: 'CS', number: 500 })
        await client.post('/classes/add', { subject: 'CS', number: 200 })

        const { status: status1, data: originalClasses } = await client.get('/classes/userlist')
        expect(status1).toBe(200)
        // * Try to remove bogus class
        await client.post('/classes/remove', {
            id: '0'
        })

        const { status: status2, data: newClasses } = await client.get('/classes/userlist')
        expect(status2).toBe(200)
        // * Check that the newClasses remain unchanged from bogus remove call
        originalClasses.forEach((cls, idx) => {
            expect(cls.subject).toBe(newClasses[idx].subject)
            expect(cls.number).toBe(newClasses[idx].number)
        })
    })

    it('Correctly retrieves list of class subjects from Banner DB', () => {
        test.todo
    })
})
