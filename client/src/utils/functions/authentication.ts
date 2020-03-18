import axios from 'axios'
import { store } from '../../models/redux/store'
import { userSignIn, userSignOut, userSignUp, userAddClass } from '../../models/redux/actions/auth'
import { userRemoveClass } from '../../models/redux/actions/auth'
import { Class } from '../../models/interfaces/Class'

const PORT = process.env.PORT || 4000
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

        if (response.status === 200) store.dispatch(userSignUp(response.data, ''))
        else store.dispatch(userSignUp(null, 'ERROR: Contact Administrator'))
    } catch (err) {
        store.dispatch(userSignUp(null, err.message))
    }
}

export const signIn = async (email: string, password: string) => {
    try {
        const response = await client.post('auth/login', { email, password })

        if (response.status === 200) store.dispatch(userSignIn(response.data, ''))
        else if (response.status === 401)
            store.dispatch(userSignIn(null, 'Invalid Username or password.'))
        else store.dispatch(userSignIn(null, 'ERROR: Contact Administrator'))
    } catch (err) {
        store.dispatch(userSignIn(null, err.message))
    }
}

export const signOut = async () => {
    try {
        const response = await client.get('auth/logout')

        if (response.status === 200 || response.status === 401)
            store.dispatch(userSignOut('Signed Out'))
        else store.dispatch(userSignOut('ERROR: Contact Administrator'))
    } catch (err) {
        store.dispatch(userSignOut(err.message))
    }
}

export const addClass = async (subject: string, number: string) => {
    try {
        const response = await client.post('classes/add', { subject, number })

        console.log(response)

        if (response.status === 200) store.dispatch(userAddClass(response.data as Class[], ''))
        else if (response.status === 401)
            store.dispatch(userAddClass(null, 'Please login to access classes'))
        else store.dispatch(userAddClass(null, 'ERROR: Contact Administrator'))
    } catch (err) {
        store.dispatch(userAddClass(null, ''))
    }
}

export const removeClass = async (_id: string) => {
    try {
        const response = await client.post('classes/remove', { _id })

        if (response.status === 200) store.dispatch(userRemoveClass(response.data as Class[], ''))
        else if (response.status === 401)
            store.dispatch(userRemoveClass(null, 'Please login to access classes'))
        else store.dispatch(userRemoveClass(null, 'ERROR: Contact Administrator'))
    } catch (err) {
        store.dispatch(userRemoveClass(null, err.message))
    }
}
