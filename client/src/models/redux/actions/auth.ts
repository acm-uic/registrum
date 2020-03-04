import { Action } from './action'
import { Class } from '../../interfaces/Class'

import axios from 'axios'

export const getClasses = (): Action => {
    axios
        .get('/api/classes/userlist', { withCredentials: true })
        .then(({ data }) => {
            return {
                type: 'SET_CLASSES',
                payload: data
            }
        })
        .catch(err => {
            console.warn(err)
            return logOut()
        })

    return logOut()
}

export const logOut = (): Action => {
    axios.get('/api/auth/logout', { withCredentials: true })

    window.location.href = '/'
    return {
        type: 'LOGOUT',
        payload: undefined
    }
}

export const signUp = (
    firstname: string,
    lastname: string,
    email: string,
    password: string
): Action => {
    axios
        .post(
            '/api/auth/signup',
            { firstname, lastname, email, password },
            { withCredentials: true }
        )
        .then(({ data }) => {
            window.location.href = '/classes/'
            return {
                type: 'LOGIN',
                payload: data
            }
        })
        .catch(err => {
            window.location.href = '/'
            console.warn(err)
            return logOut()
        })

    window.location.href = '/classes'
    return logOut()
}

export const logIn = (email: string, password: string): Action => {
    axios
        .post('/api/auth/login', { email, password }, { withCredentials: true })
        .then(({ data }) => {
            window.location.href = '/classes/'
            return {
                type: 'LOGIN',
                payload: data
            }
        })
        .catch(err => {
            window.location.href = '/'
            console.warn(err)
            return logOut()
        })

    window.location.href = '/classes'
    return logOut()
}

export const addClass = (cls: Class): Action => {
    axios
        .post(
            '/api/classes/add',
            { subject: cls.title, number: cls.number },
            { withCredentials: true }
        )
        .then(({ data }) => {
            return {
                type: 'ADD_CLASS',
                payload: data
            }
        })
        .catch(err => {
            console.warn(err)
            return logOut()
        })

    return logOut()
}

export const removeClass = (cls: Class): Action => {
    axios
        .post(
            '/api/classes/remove',
            {
                subject: cls.title,
                number: cls.number
            },
            { withCredentials: true }
        )
        .then(({ data }) => {
            return {
                type: 'REMOVE_CLASS',
                payload: data
            }
        })
        .catch(err => {
            console.warn(err)
            return logOut()
        })

    return logOut()
}

export const updateUser = (firstname: string, lastname: string): Action => {
    //TODO: Make request to update user

    window.location.href = '/'
    return {
        type: 'UPDATE_USER',
        payload: null
    }
}
