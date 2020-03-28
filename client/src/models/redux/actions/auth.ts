import { Action, ThunkActionCreator } from './action'
import { User } from '../../interfaces/User'
import axios from 'axios'
import { State } from '../store'
export const setUser = (user: User | null): Action => ({
    payload: user,
    type: 'SET_USER'
})

export const updateUser = (): ThunkActionCreator => {
    return async (dispatch, getState) => {
        const state: State = getState()
        const { Auth } = state

        // * Retrieve updated user object
        try {
            const response = await axios.get('/api/auth/')
            const user = response.data

            if (
                response.status === 200 &&
                (user.subscriptions.length !== Auth.user.subscriptions.length || Auth.user === null)
            ) {
                // * Set user
                dispatch(setUser(user))
            }
        } catch (err) {
            const { response } = err
            if (response.status === 401 && Auth.user !== null) {
                dispatch(setUser(null))
            }
        }
    }
}
