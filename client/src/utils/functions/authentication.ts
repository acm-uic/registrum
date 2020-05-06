import axios from 'axios'
import { toast } from 'react-toastify'
import { User } from '../../models/interfaces/User'
import { setUser } from '../../models/redux/actions/auth'
import { store } from '../../models/redux/store'

import { initializeSW } from '../../serviceWorker'

const basePath = process.env.API_BASE_PATH || '/api'
const URL = `${basePath}/`

const client = axios.create({
    baseURL: URL,
    validateStatus: () => true,
    withCredentials: true
})

async function getSubscriptionObject() {
    //* navigator --> the core of service workers
    if ('serviceWorker' in navigator) {
        try {
            // * Getting the registeration object
            const registration = await navigator.serviceWorker.ready

            initializeSW(registration)

            // * using the registeration object --> to get the subscription object
            const subscription = await registration.pushManager.getSubscription()

            // * Return subscription if not null
            return JSON.stringify(subscription)
        } catch (err) {
            console.error(err)
            return null
        }
    } else {
        return null
    }
}

export const signUp = async (fn: string, ln: string, em: string, pw: string) => {
    try {
        const response = await client.post('auth/signup', {
            firstname: fn,
            lastname: ln,
            email: em,
            password: pw
        })

        if (response.status === 200) {
            toast('Signed Up succesfully', {
                type: 'success'
            })

            // * Get user data
            const user = response.data as User

            // * Set user data
            store.dispatch(setUser(user))

            if (user.emailNotificationsEnabled && 'serviceWorker' in navigator) {
                //* Get subscription from navigator object
                const subscription = await getSubscriptionObject()

                // * Subscribe client using subscription from service worker if available
                if (subscription !== null) {
                    await client.post('/push-service/save-client-subscriptions', { subscription })
                }
            }
        } else {
            toast(response.data, { type: response.status === 400 ? 'info' : 'error' })

            // * Set user to null
            store.dispatch(setUser(null))
        }
    } catch (err) {
        toast(err.message as string, {
            type: 'error'
        })

        // * Set user to null
        store.dispatch(setUser(null))
    }
}

export const signIn = async (email: string, password: string) => {
    try {
        // * logging in user --> they must be logged in before sending over browser subscription object
        const response = await client.post('auth/login', { email, password })

        if (response.status === 200) {
            toast('Signed in succesfully', {
                type: 'success'
            })

            // * Get user data
            const user = response.data as User

            // * Set user data
            store.dispatch(setUser(user))

            if (user.emailNotificationsEnabled && 'serviceWorker' in navigator) {
                //* Get subscription from navigator object
                const subscription = await getSubscriptionObject()

                // * Subscribe client using subscription from service worker if available
                if (subscription !== null) {
                    await client.post('/push-service/save-client-subscriptions', { subscription })
                }
            }
        } else {
            toast(response.data, { type: response.status === 400 ? 'info' : 'error' })
            // * Set user to null
            store.dispatch(setUser(null))
        }
    } catch (err) {
        toast(err.message as string, {
            type: 'error'
        })

        // * Set user to null
        store.dispatch(setUser(null))
    }
}

export const signOut = async () => {
    try {
        // * checking browser if service workers are supported
        if ('serviceWorker' in navigator) {
            // * Getting the registeration object
            const registration = await navigator.serviceWorker.ready

            // * using the registeration object --> to get the subscription object
            const subscription = JSON.stringify(await registration.pushManager.getSubscription())

            // * Sending POST requst to remove subscription object from DB
            if (subscription !== null) {
                await client.post('/push-service/unsubscribe-client', { subscription })
            }
        }

        const response = await client.get('auth/logout')

        if (response.status === 200 || response.status === 401) {
            toast('Signed out succesfully', { type: 'success' })
            // * Set user to null
            store.dispatch(setUser(null))
        } else {
            toast('ERROR: Contact Administrator', {
                type: 'error'
            })
        }
    } catch (err) {
        toast(err.message as string, {
            type: 'error'
        })
    }
}
