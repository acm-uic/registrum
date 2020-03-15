import dotenv from 'dotenv'
import axios from 'axios'
import User from '../routes/models/User'
import general from '../app'

dotenv.config()
const app = general
const PORT = process.env.PORT || 8081
const BASE_PATH = process.env.BASE_PATH || '/api'
const URL = `http://localhost:${PORT}${BASE_PATH}/classes/`

const server = app.listen(PORT)

describe('Class Tests', () => {
    afterAll(async () => {
        //Remove user from DB
        await User.deleteMany({}).then(() => {
            console.log('Clear up done')
        })
    })

    let cookie = ''
    let classID = ''
    const client = axios.create({
        baseURL: URL,
        validateStatus: () => {
            /* always resolve on any HTTP status */
            return true
        }
    })

    describe('Precondition Tests', () => {
        it('Register an account', async () => {
            await axios
                .post(`http://localhost:${PORT}${BASE_PATH}/auth/signup`, {
                    firstname: 'Clark',
                    lastname: 'Chen',
                    email: 'schen237a@uic.edu',
                    password: 'theRealClark'
                })
                .then(response => {
                    cookie = String(response.headers['set-cookie'])
                    expect(response.status).toBe(200)
                    if (response.status != 200) {
                        console.log(response.data)
                    }
                })
        })
    })

    describe('Sanity Tests', () => {
        it('Correctly add class to user watch list', async () => {
            await client
                .post(
                    'add',
                    {
                        subject: 'CS',
                        number: 494
                    },
                    {
                        headers: {
                            Cookie: cookie
                        }
                    }
                )
                .then(response => {
                    classID = response.data['_id']
                    expect(response.status).toBe(200)
                    if (response.status != 200) {
                        console.log(response.data)
                    }
                })
        })

        it('Missing subject field when add class to user watch list', async () => {
            await client
                .post(
                    'add',
                    {
                        number: 494
                    },
                    {
                        headers: {
                            Cookie: cookie
                        }
                    }
                )
                .then(response => {
                    expect(response.status).toBe(500)
                    expect(response.data).toBe('Missing course subject')
                })
        })

        it('Missing subject field when add class to user watch list', async () => {
            await client
                .post(
                    'add',
                    {
                        subject: 'CS'
                    },
                    {
                        headers: {
                            Cookie: cookie
                        }
                    }
                )
                .then(response => {
                    expect(response.status).toBe(500)
                    expect(response.data).toBe('Missing course number')
                })
        })

        it('Correctly retrieves classes for given subject', async () => {
            await client
                .get('userlist', {
                    headers: {
                        Cookie: cookie
                    }
                })
                .then(response => {
                    if (response.status != 200) {
                        console.log(response.data)
                    }
                    expect(response.status).toBe(200)
                    expect(response.data[0]['subject']).toBe('CS')
                    expect(response.data[0]['number']).toBe(494)
                })
        })

        it('Unauthorized retrieves classes for given subject', async () => {
            await client.get('userlist').then(response => {
                expect(response.status).toBe(401)
                expect(response.data).toBe('Error, Not logged in')
                if (response.status != 401) {
                    console.log(response.data)
                }
            })
        })

        it('Correctly remove class from user watch list', async () => {
            await client
                .post(
                    'remove',
                    {
                        _id: classID
                    },
                    {
                        headers: {
                            Cookie: cookie
                        }
                    }
                )
                .then(response => {
                    expect(response.status).toBe(200)
                    if (response.status != 200) {
                        console.log(response.data)
                    }
                })
        })

        it('Remove class with invalid classID from user watch list', async () => {
            await client
                .post(
                    'remove',
                    {
                        _id: '0'
                    },
                    {
                        headers: {
                            Cookie: cookie
                        }
                    }
                )
                .then(response => {
                    expect(response.status).toBe(400)
                    if (response.status != 200) {
                        console.log(response.data)
                    }
                })
        })

        it('Correctly retrieves list of class subjects from Banner DB', () => {
            test.todo
        })
    })
})
