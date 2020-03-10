import axios from 'axios'
import { store } from '@redux/store'
import { userSignIn, userSignOut, userSignUp, userAddClass } from '@actions/auth'

export const signUp = async (fn: string, ln: string, em: string, pw: string) => {
    try {
        const response = await axios.post(
            '/api/auth/signup',
            { firstname: fn, lastname: ln, email: em, password: pw },
            { withCredentials: true }
        )

        if (response.status == 200) store.dispatch(userSignUp(response.data, ''))
        else store.dispatch(userSignIn(null, response.data))
    } catch (err) {
        store.dispatch(userSignIn(null, err))
    }
}

export const signIn = async (email: string, password: string) => {
    try {
        const response = await axios.post(
            '/api/auth/login',
            { email, password },
            { withCredentials: true }
        )

        if (response.status == 200) store.dispatch(userSignIn(response.data, ''))
        else store.dispatch(userSignIn(null, response.data))
    } catch (err) {
        store.dispatch(userSignIn(null, err))
    }
}

export const signOut = async () => {
    try {
        const response = await axios.get('/api/auth/logout', { withCredentials: true })

        if (response.status == 200) store.dispatch(userSignOut(''))
        else if (response.status == 401) store.dispatch(userSignOut('You are not signed in'))
        else store.dispatch(userSignOut('Error Occured'))
    } catch (err) {
        store.dispatch(userSignOut(err))
    }
}

export const addClass = async (subject: string, number: string) => {
    try {
        const response = await axios.post(
            '/api/classes/add',
            { subject, number },
            { withCredentials: true }
        )

        if (response.status == 200) store.dispatch(userAddClass({ number, subject }, ''))
        else if (response.status == 401) store.dispatch(userSignOut('You are not signed in'))
        else store.dispatch(userSignOut('Error Occured'))
    } catch (err) {
        store.dispatch(userAddClass(null, ''))
    }
}
