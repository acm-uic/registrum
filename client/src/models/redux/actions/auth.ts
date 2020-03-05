import { Action } from './action'
import { User } from '@interfaces/User'

export const template = (): Action => {
    return {
        payload: null,
        type: ''
    }
}
export const userSignIn = (user: User | null, error?: string): Action => {
    console.debug('userSignIn - User', user)
    console.debug('userSignIn - Error', error)

    return {
        payload: { user, error },
        type: 'SIGN_IN'
    }
}
