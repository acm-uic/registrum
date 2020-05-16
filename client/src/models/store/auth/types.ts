import User from '../../interfaces/User'
import Class from 'models/interfaces/Class'
import { Action } from 'redux'

export const SET_USER = 'SET_USER'
export const UNSET_USER = 'UNSET_USER'

export const ADD_CLASS = 'ADD_CLASS'
export const REMOVE_CLASS = 'REMOVE_CLASS'

// * Set the user
interface SetUserAction extends Action {
    type: typeof SET_USER
    payload: User
}

// * Set the user to null
interface UnsetUserAction extends Action {
    type: typeof UNSET_USER
}

// * Add a class to the user
interface AddClassAction extends Action {
    type: typeof ADD_CLASS
    payload: Class
}

// * Add a class to the user
interface RemoveClassAction extends Action {
    type: typeof REMOVE_CLASS
    payload: string
}

// * Cummalative Type
export type UserActionTypes = SetUserAction | UnsetUserAction | AddClassAction | RemoveClassAction
