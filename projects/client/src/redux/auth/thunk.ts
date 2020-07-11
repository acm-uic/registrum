import axios from 'axios'

import { IUser } from '../../interfaces/IUser'
import { AppThunk } from '../store'
import { setUser, unsetUser, setCourses } from './actions'
import { SignUpProps, SignInProps, CourseSubscribeProps, CourseUnsubscribeProps } from './types'
import { getSubscriptionObject } from '../../helpers/functions'
import { Course } from 'registrum-common/dist/lib/Banner'

// * Setting the path for the api calls
const basePath = process.env.API_BASE_PATH || '/api'
const baseURL = `${basePath}/`

// * Single axios client for continuity
export const client = axios.create({
    baseURL,
    validateStatus: () => true,
    withCredentials: true
})

export const updateUser = (): AppThunk => async (dispatch, getState) => {
    const { auth } = getState()

    try {
        // * Retrieve updated user object
        const response = await client.get('auth/')
        const user = response.data as IUser

        // * If cookie has expired and a user is present
        if (response.status === 401 && auth.user !== null) {
            dispatch(unsetUser())
        }

        // * Check if any property changed for a re-render
        const shouldUpdate = JSON.stringify(user) !== JSON.stringify(auth.user)

        // * User has update or
        if (response.status === 200) {
            if (shouldUpdate) dispatch(setUser(user))
            dispatch(getUserCourses())
        }
    } catch (err) {
        // * Log the error message
        console.error(err.message)

        // toast('🚨 Could not connect to the API', { type: 'error' })

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
            const user = response.data as IUser

            // * Set user data
            dispatch(setUser(user))

            // * Give client notification
            // toast('🎉 Successfully registered', { type: 'success' })

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
            // toast(response.data, { type: 'info' })
        }
    } catch (err) {
        // * Log the error message
        console.error(err.message)

        // toast('🚨 Could not connect to the API', { type: 'error' })
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
            const user = response.data as IUser

            // * Set user data
            dispatch(setUser(user))

            // * Give client notification
            // toast('✨ Logged in successfully', { type: 'success' })

            if (user.emailNotificationsEnabled && 'serviceWorker' in navigator) {
                //* Get subscription from navigator object
                const subscription = await getSubscriptionObject()

                // * Subscribe client using subscription from service worker if available
                if (subscription !== null) {
                    await client.post('/push-service/save-client-subscriptions', { subscription })
                }
            }
        } else if (response.status === 401) {
            // toast('Invalid Email / Password', { type: 'info' })
        }
    } catch (err) {
        // * Log the error message
        console.error(err.message)

        // toast('🚨 Could not connect to the API', { type: 'error' })
    }
}

export const signOutUser = (): AppThunk => async (dispatch, getState) => {
    const { auth } = getState()

    // * No user logged in
    if (auth.user === null) return

    try {
        // * checking browser if service workers are supported
        if ('serviceWorker' in navigator) {
            // * Getting the registration object
            const registration = await navigator.serviceWorker.ready

            // * using the registration object --> to get the subscription object
            const _subscription = await registration.pushManager.getSubscription()

            // * Sending POST request to remove subscription object from DB
            if (_subscription !== null) {
                const subscription = JSON.stringify(_subscription)
                await client.post('/push-service/unsubscribe-client', { subscription })
            }
        }

        const response = await client.get('auth/logout')

        // * Checking if server successfully signed out
        if (response.status === 200 || response.status === 401) {
            // toast('👋 Signed out successfully', { type: 'success' })

            // * Set user to null
            dispatch(unsetUser())
        }
    } catch (err) {
        // * Log the error message
        console.error(err.message)

        // toast('🚨 Could not connect to the API', { type: 'error' })
    }
}

export const getUserCourses = (): AppThunk => async (dispatch, getState) => {
    const { user } = getState().auth

    // * No user logged in
    if (!user) return

    try {
        // * Grab class data for use
        const response = await client.get('/banner/tracking')

        if (response.status === 200) {
            const courses = response.data as Course[]

            // * Add the courses to redux
            dispatch(setCourses(courses))
        }

        if (response.status === 401) {
            // * User expired

            // * Set user to null
            dispatch(unsetUser())
        }
    } catch (err) {
        // * Log the error message
        console.error(err.message)

        // toast('🚨 Could not connect to the API', { type: 'error' })
    }
}

export const courseSubscribe = (data: CourseSubscribeProps): AppThunk => async (
    dispatch,
    getState
) => {
    const { user } = getState().auth

    // * No user logged in
    if (!user) return

    try {
        // * Subscribe to the specific class
        const response = await client.post('/banner/subscribe', data)

        if (response.status === 200) {
            // * Update user
            dispatch(updateUser())
        }

        if (response.status === 401) {
            // * User expired

            // * Set user to null
            dispatch(unsetUser())
        }
    } catch (err) {
        // * Log the error message
        console.error(err.message)

        // toast('🚨 Could not connect to the API', { type: 'error' })
    }
}

export const courseUnsubscribe = (data: CourseUnsubscribeProps): AppThunk => async (
    dispatch,
    getState
) => {
    const { user } = getState().auth

    // * No user logged in
    if (!user) return

    try {
        // * Unsubscribe to the specific class
        const response = await client.post('/banner/unsubscribe', data)

        if (response.status === 200) {
            // * Update user
            dispatch(updateUser())
        }

        if (response.status === 401) {
            // * User expired

            // * Set user to null
            dispatch(unsetUser())
        }
    } catch (err) {
        // * Log the error message
        console.error(err.message)

        // toast('🚨 Could not connect to the API', { type: 'error' })
    }
}
