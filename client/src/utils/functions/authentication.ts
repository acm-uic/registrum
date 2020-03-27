import axios from 'axios'
import { store } from '../../models/redux/store'
import { userSignIn, userSignOut, userSignUp, userAddClass } from '../../models/redux/actions/auth'
import { userRemoveClass } from '../../models/redux/actions/auth'
import { Class } from '../../models/interfaces/Class'

const BASE_PATH = process.env.BASE_PATH || '/api'
const URL = `${BASE_PATH}/`

const client = axios.create({
    baseURL: URL,
    validateStatus: () => true,
    withCredentials: true
})

export const signUp = async (fn: string, ln: string, em: string, pw: string) => {
    try {
        const response = await client.post('auth/signup', {
            firstname: fn,
            lastname: ln,
            email: em,
            password: pw
        })

        if (response.status === 200)
            store.dispatch(
                userSignUp(response.data, {
                    msg: 'Signed Up succesfully',
                    options: {
                        type: 'success'
                    }
                })
            )
        else if (response.status === 400)
            store.dispatch(
                userSignUp(null, {
                    msg: 'Email already exist! Please login',
                    options: {
                        type: 'info'
                    }
                })
            )
        else
            store.dispatch(
                userSignUp(null, {
                    msg: 'ERROR: Contact Administrator',
                    options: {
                        type: 'error'
                    }
                })
            )
    } catch (err) {
        store.dispatch(
            userSignUp(null, {
                msg: err.message as String,
                options: {
                    type: 'error'
                }
            })
        )
    }
}

export const signIn = async (email: string, password: string) => {
    try {
        const response = await client.post('auth/login', { email, password })

        if (response.status === 200)
            store.dispatch(
                userSignIn(response.data, {
                    msg: 'Signed In succesfully',
                    options: {
                        type: 'success'
                    }
                })
            )
        else if (response.status === 401)
            store.dispatch(
                userSignIn(null, {
                    msg: 'Invalid Username or password',
                    options: {
                        type: 'warning'
                    }
                })
            )
        else
            store.dispatch(
                userSignIn(null, {
                    msg: 'ERROR: Contact Administrator',
                    options: {
                        type: 'error'
                    }
                })
            )
    } catch (err) {
        store.dispatch(
            userSignIn(null, {
                msg: err.message as String,
                options: {
                    type: 'error'
                }
            })
        )
    }
}

export const signOut = async () => {
    try {
        const response = await client.get('auth/logout')

        if (response.status === 200 || response.status === 401)
            store.dispatch(
                userSignOut({ msg: 'Signed out succesfully', options: { type: 'success' } })
            )
        else
            store.dispatch(
                userSignOut({
                    msg: 'ERROR: Contact Administrator',
                    options: {
                        type: 'error'
                    }
                })
            )
    } catch (err) {
        store.dispatch(
            userSignOut({
                msg: err.message as String,
                options: {
                    type: 'error'
                }
            })
        )
    }
}

export const addClass = async (subject: string, number: string) => {
    try {
        const response = await client.post('classes/add', { subject, number })

        console.log(response)

        if (response.status === 200)
            store.dispatch(
                userAddClass(response.data as Class[], {
                    msg: 'Class added succesfully',
                    options: {
                        type: 'success'
                    }
                })
            )
        else if (response.status === 401)
            store.dispatch(
                userAddClass(null, {
                    msg: 'Please login to access classes',
                    options: {
                        type: 'warning'
                    }
                })
            )
        else
            store.dispatch(
                userAddClass(null, {
                    msg: 'ERROR: Contact Administrator',
                    options: {
                        type: 'error'
                    }
                })
            )
    } catch (err) {
        store.dispatch(
            userAddClass(null, {
                msg: err.message as String,
                options: {
                    type: 'error'
                }
            })
        )
    }
}

export const removeClass = async (_id: string) => {
    try {
        const response = await client.post('classes/remove', { _id })

        if (response.status === 200)
            store.dispatch(
                userRemoveClass(response.data as Class[], {
                    msg: 'Class removed succesfully',
                    options: {
                        type: 'success'
                    }
                })
            )
        else if (response.status === 401)
            store.dispatch(
                userRemoveClass(null, {
                    msg: 'Please login to access classes',
                    options: {
                        type: 'warning'
                    }
                })
            )
        else
            store.dispatch(
                userRemoveClass(null, {
                    msg: 'ERROR: Contact Administrator',
                    options: {
                        type: 'error'
                    }
                })
            )
    } catch (err) {
        store.dispatch(
            userRemoveClass(null, {
                msg: err.message as String,
                options: {
                    type: 'error'
                }
            })
        )
    }
}
