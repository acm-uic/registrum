import { Action } from './action'
import { User } from '../../interfaces/User'
import { Class } from '../../interfaces/Class'

export const userSignUp = (user: User | null, error?: string): Action => ({
    payload: { user, error },
    type: 'SIGN_UP'
})

export const userSignIn = (user: User | null, error?: string): Action => ({
    payload: { user, error },
    type: 'SIGN_IN'
})

export const userSignOut = (error: string): Action => ({
    payload: { error },
    type: 'SIGN_OUT'
})

export const userAddClass = (cls: Class[] | null, error: string): Action => ({
    payload: { cls, error },
    type: 'ADD_CLASS'
})

export const userRemoveClass = (cls: Class[] | null, error: string): Action => ({
    payload: { cls, error },
    type: 'REMOVE_CLASS'
})
