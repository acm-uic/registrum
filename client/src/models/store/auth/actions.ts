import User from '@interfaces/User'
import { UserActionTypes, SET_USER, UNSET_USER, ADD_CLASS, REMOVE_CLASS } from '@redux/auth/types'
import Class from '@interfaces/Class'

// * Set the user in state to the user in the payload
export const setUser = (user: User): UserActionTypes => ({
    payload: user,
    type: SET_USER
})

// * No payload needed since it will be set to null
export const unsetUser = (): UserActionTypes => ({
    type: UNSET_USER
})

// * Add a class to the user
export const addClass = (cls: Class): UserActionTypes => ({
    type: ADD_CLASS,
    payload: cls
})

// * Remove the specified class from the user
export const removeClass = (id: string): UserActionTypes => ({
    type: REMOVE_CLASS,
    payload: id
})
