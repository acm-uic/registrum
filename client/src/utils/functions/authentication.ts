import axios from 'axios'
import { toast } from 'react-toastify'
import { User } from '@interfaces/User'
import { setUser } from '../../models/redux/actions/auth'
import { store } from '../../models/redux/store'

const basePath = process.env.API_BASE_PATH || '/api'
const URL = `${basePath}/`

const client = axios.create({
    baseURL: URL,
    validateStatus: () => true,
    withCredentials: true
})

// * function determines if localhost or not
const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === '[::1]' ||
        // 127.0.0.0/8 are considered localhost for IPv4.
        window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)

async function getSubscriptionObject() {
    //* navigator --> the core of service workers
    if ('serviceWorker' in navigator) {
        // * this URL will be used once deployed
        let swUrl = `${process.env.PUBLIC_URL}/service-worker.js`

        if (isLocalhost) {
            swUrl = `./service-worker.js`
        }

        // * getting the registeration object
        const registration = await navigator.serviceWorker.getRegistration(swUrl)

        // * using the registeration object --> to get the subscription object
        const subObject = await registration?.pushManager.getSubscription()

        return JSON.stringify(subObject)
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

        //* getting subscription object from navigator object to send it w/ login route
        const subscriptionObject = await getSubscriptionObject()

        // * subscribe client using subscription object from service worker
        await client.post('/push-service/save-client-subscriptions', { subscriptionObject })

        if (response.status === 200) {
            toast('Signed Up succesfully', {
                type: 'success'
            })
            // * Set user
            store.dispatch(setUser(response.data as User))
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
        //* getting subscription object from navigator object to send it w/ login route
        const subscriptionObject = await getSubscriptionObject()

        // * logging in user --> they must be logged in before sending over browser subscription object
        const response = await client.post('auth/login', { email, password })

        // * subscribe client using subscription object from service worker
        await client.post('/push-service/save-client-subscriptions', { subscriptionObject })

        if (response.status === 200) {
            toast('Signed in succesfully', {
                type: 'success'
            })
            // * Set user
            store.dispatch(setUser(response.data as User))
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

async function unsubscribeUser() {
    // * checking browser if service workers are supported
    if ('serviceWorker' in navigator) {
        // * getting the subscription object so that it can be used to delete it from DB
        const subscriptionObject = await getSubscriptionObject()

        // * sending post requst to remove subscription object from DB
        await client.post('/push-service/unsubscribe-client', { subscriptionObject })
    }
}

export const signOut = async () => {
    try {
        // * calling function to unsubscribe user before they log out.
        // * this prevents user from getting class notifications after they've logged out
        await unsubscribeUser()

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
