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

export async function unsubscribePushNotification(){

    // const subscription = localStorage.getItem("subscriptionObject");

    await client.post('http://localhost:4000/api/push-service/test');


    // //@ts-ignore
    // return new Promise(function(resolve) {

    //     client.post('http://localhost:4000/api/push-service/unsubscribe-client', { subscription })
       
    // }).then((response: unknown) => {
    //     console.log(response);
    // });

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
        const subscriptionObject = localStorage.getItem("subscriptionObject");

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

export const signOut = async () => {
    try {
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
