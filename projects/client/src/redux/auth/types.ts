import { IUser } from '../../interfaces/IUser'
import { Action } from 'redux'
import { CourseNumber } from '../../interfaces/CourseNumber'

export const SET_USER = 'SET_USER'
export const UNSET_USER = 'UNSET_USER'

export const ADD_COURSE_NUMBER = 'ADD_COURSE_NUMBER'
export const REMOVE_COURSE_NUMBER = 'REMOVE_COURSE_NUMBER'

// * Set the user
interface SetUserAction extends Action {
    type: typeof SET_USER
    payload: IUser
}

// * Set the user to null
interface UnsetUserAction extends Action {
    type: typeof UNSET_USER
}

// * Cumulative Type
export type UserActionTypes = SetUserAction | UnsetUserAction

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
