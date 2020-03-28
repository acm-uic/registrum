import { Action, ThunkActionCreator } from './action'
import { User } from '../../interfaces/User'
import axios from 'axios'
import { toast } from 'react-toastify'
export const setUser = (user: User | null): Action => ({
    payload: user,
    type: 'SET_USER'
})

export const updateUser = (): ThunkActionCreator => {
    return async dispatch => {
        try {
            // * Retrieve updated user object
            const { data: user } = await axios.get('/api/auth/')
            // * Set user
            dispatch(setUser(user))
        } catch (err) {
            toast('Error Syncing User!', { type: 'error' })
        }
    }
}
