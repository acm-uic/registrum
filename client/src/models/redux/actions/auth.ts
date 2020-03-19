import { Action } from './action'
import { User } from '../../interfaces/User'
import { Class } from '../../interfaces/Class'
import { Message } from '../../interfaces/Message'

export const userSignUp = (user: User | null, msg?: Message): Action => ({
    payload: { user, msg },
    type: 'SIGN_UP'
})

export const userSignIn = (user: User | null, msg?: Message): Action => ({
    payload: { user, msg },
    type: 'SIGN_IN'
})

export const userSignOut = (msg?: Message): Action => ({
    payload: { msg },
    type: 'SIGN_OUT'
})

export const userAddClass = (cls: Class[] | null, msg?: Message): Action => ({
    payload: { cls, msg },
    type: 'ADD_CLASS'
})

export const userRemoveClass = (cls: Class[] | null, msg?: Message): Action => ({
    payload: { cls, msg },
    type: 'REMOVE_CLASS'
})
