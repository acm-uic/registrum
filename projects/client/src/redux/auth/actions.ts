import { IUser } from '../../interfaces/IUser'
import { UserActionTypes, SET_USER, UNSET_USER, SET_COURSES, SET_LOADING } from './types'
import { Course } from 'registrum-common/dist/lib/Banner'

// * Set the user in state to the user in the payload
export const setUser = (user: IUser): UserActionTypes => ({
    payload: user,
    type: SET_USER
})

// * No payload needed since it will be set to null
export const unsetUser = (): UserActionTypes => ({
    type: UNSET_USER
})

export const setCourses = (courses: Course[]): UserActionTypes => ({
    type: SET_COURSES,
    payload: courses
})

export const setLoading = (status: boolean): UserActionTypes => ({
    type: SET_LOADING,
    payload: status
})
