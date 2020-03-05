import { Action } from './action'
import { User } from '@interfaces/User'

export const userSignUp = (user: User | null, error?: string): Action => ({
    payload: { user, error },
    type: 'SIGN_UP'
})

export const userSignIn = (user: User | null, error?: string): Action => ({
    payload: { user, error },
    type: 'SIGN_IN'
})

export const userSignOut = (error: string): Action => ({
    payload: error,
    type: 'SIGN_OUT'
})
