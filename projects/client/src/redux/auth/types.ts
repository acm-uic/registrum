import { IUser } from '../../interfaces/IUser'
import { Course } from 'registrum-common/dist/lib/Banner'
import { Action } from 'redux'

export const SET_USER = 'SET_USER'
export const UNSET_USER = 'UNSET_USER'

export const ADD_CLASS = 'ADD_CLASS'
export const REMOVE_CLASS = 'REMOVE_CLASS'

// * Set the user
interface SetUserAction extends Action {
    type: typeof SET_USER
    payload: IUser
}

// * Set the user to null
interface UnsetUserAction extends Action {
    type: typeof UNSET_USER
}

// * Add a class to the user
interface AddClassAction extends Action {
    type: typeof ADD_CLASS
    payload: Course
}

// * Add a class to the user
interface RemoveClassAction extends Action {
    type: typeof REMOVE_CLASS
    payload: string
}

// * Cumulative Type
export type UserActionTypes = SetUserAction | UnsetUserAction | AddClassAction | RemoveClassAction

// * Data needed to register a new user
export interface SignUpProps {
    firstname: string
    lastname: string
    email: string
    password: string
    emailNotificationsEnabled: boolean
    boolEmail: boolean
}

// * Data needed to login using email / password
export interface SignInProps {
    email: string
    password: string
}
