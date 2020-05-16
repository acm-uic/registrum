import axios from 'axios'

import User from '../../interfaces/User'
import { AppThunk } from '../'
import { setUser, unsetUser } from './actions'

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

    // * Retrieve updated user object
    try {
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
        console.table(err)
    }
}
