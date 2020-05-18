import axios from 'axios'
import { toast } from 'react-toastify'

import User from '@interfaces/User'
import { AppThunk } from '@redux/.'
import { setUser, unsetUser } from '@redux/auth/actions'
import { SignUpProps, SignInProps } from '@redux/auth/types'
import { getSubscriptionObject } from '@utils/globals'

// * Setting the path for the api calls
const basePath = process.env.API_BASE_PATH || '/api'
const URL = `${basePath}/`

// * Single axios client for continuity
export const client = axios.create({
    baseURL: URL,
    validateStatus: () => true,
    withCredentials: true
})

export const updateUser = (): AppThunk => async (dispatch, getState) => {
    const { auth } = getState()

    try {
        // * Retrieve updated user object
        const response = await client.get('/api/auth/')
        const user = response.data as User

        // * If cookie has expired and a user is present
        if (response.status === 401 && auth.user !== null) {
            dispatch(unsetUser())
        }

        // * Check if any property changed for a rerender
        const shouldUpdate = JSON.stringify(user) === JSON.stringify(auth.user)

        // * User has update or
        if (response.status === 200 && shouldUpdate) {
            dispatch(setUser(user))
        }
    } catch (err) {
        // * Log the error message
        console.error(err.message)

        toast('🚨 Could not connect to the API', { type: 'error' })

        // * Set user to null
        dispatch(unsetUser())
    }
}

export const signUpUser = (data: SignUpProps): AppThunk => async (dispatch, getState) => {
    const { auth } = getState()

    // * User is already logged in
    if (auth.user) return

    try {
        // * Try to register the user
        const response = await client.post('auth/signup', data)

        if (response.status === 200) {
            // * Get user data
            const user = response.data as User

            // * Set user data
            dispatch(setUser(user))

            // * Give client notification
            toast('🎉 Succesfully registered', { type: 'success' })

            if (user.emailNotificationsEnabled && 'serviceWorker' in navigator) {
                //* Get subscription from navigator object
                const subscription = await getSubscriptionObject()

                // * Subscribe client using subscription from service worker if available
                if (subscription !== null) {
                    await client.post('/push-service/save-client-subscriptions', { subscription })
                }
            }
        } else {
            // * Email already used or bad input
            toast(response.data, { type: 'info' })
        }
    } catch (err) {
        // * Log the error message
        console.error(err.message)

        toast('🚨 Could not connect to the API', { type: 'error' })
    }
}

export const signInUser = (data: SignInProps): AppThunk => async (dispatch, getState) => {
    const { auth } = getState()

    // * User is already logged in
    if (auth.user) return

    try {
        // * Logging in user --> they must be logged in before sending over browser subscription object
        const response = await client.post('auth/login', data)

        if (response.status === 200) {
            // * Get user data
            const user = response.data as User

            // * Set user data
            dispatch(setUser(user))

            // * Give client notification
            toast('✨ Logged in succesfully', { type: 'success' })

            if (user.emailNotificationsEnabled && 'serviceWorker' in navigator) {
                //* Get subscription from navigator object
                const subscription = await getSubscriptionObject()

                // * Subscribe client using subscription from service worker if available
                if (subscription !== null) {
                    await client.post('/push-service/save-client-subscriptions', { subscription })
                }
            }
        } else if (response.status === 401) {
            toast('Invalid Email / Password', { type: 'info' })
        }
    } catch (err) {
        // * Log the error message
        console.error(err.message)

        toast('🚨 Could not connect to the API', { type: 'error' })
    }
}

export const signOutUser = (): AppThunk => async (dispatch, getState) => {
    const { auth } = getState()

    // * No user logged in
    if (auth.user === null) return

    try {
        // * checking browser if service workers are supported
        if ('serviceWorker' in navigator) {
            // * Getting the registeration object
            const registration = await navigator.serviceWorker.ready

            // * using the registeration object --> to get the subscription object
            const _subscription = await registration.pushManager.getSubscription()

            // * Sending POST requst to remove subscription object from DB
            if (_subscription !== null) {
                const subscription = JSON.stringify(_subscription)
                await client.post('/push-service/unsubscribe-client', { subscription })
            }
        }

        const response = await client.get('auth/logout')

        // * Checking if server successfully signed out
        if (response.status === 200 || response.status === 401) {
            toast('👋 Signed out succesfully', { type: 'success' })

            // * Set user to null
            dispatch(unsetUser())
        }
    } catch (err) {
        // * Log the error message
        console.error(err.message)

        toast('🚨 Could not connect to the API', { type: 'error' })
    }
}
