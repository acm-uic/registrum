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

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === '[::1]' ||
        // 127.0.0.0/8 are considered localhost for IPv4.
        window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)

async function getSubscriptionObject(){
    if('serviceWorker' in navigator){

        let swUrl = `${process.env.PUBLIC_URL}/service-worker.js`

        if (isLocalhost) { 
            swUrl = `./service-worker.js`
        }

        // * getting the registeration object
        const registration = await navigator.serviceWorker.getRegistration(swUrl);

        // * using the registeration object --> to get the subscription object
        const subObject = await registration?.pushManager.getSubscription();

        return JSON.stringify(subObject);

    }else{
        return null;
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


export function registerWithLogin(){

    if ('serviceWorker' in navigator ) {
        
        console.log('Service Worker is supported with registerWithLogin');

    }else{
        console.log('Service Worker is NOT supported with registerWithLogin')
    }

}

export const signIn = async (email: string, password: string) => {
    try {

        //* getting subscription object from local storage to send it w/ login route
        let subscriptionObject = await getSubscriptionObject();
        // let subscriptionObjectJSON = JSON.stringify(subscriptionObject);

        console.log("subscriptionObject in signin method: " + subscriptionObject);
    
        //! fixme: pass push notifcation subscription object here
        const response = await client.post('auth/login', { email, password, subscriptionObject })
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


async function unsubscribeUser(){
    if('serviceWorker' in navigator){

        // * getting the subscription object so that it can be used to delete it from DB
        let subscriptionObject = await getSubscriptionObject();

        // * sending post requst to remove subscription object from DB
        await client.post('/push-service/unsubscribe-client', { subscriptionObject });

    }
}

export const signOut = async () => {
    try {

        await unsubscribeUser();

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
