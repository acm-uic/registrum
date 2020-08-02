import { IUser } from '../../interfaces/IUser'
import { SET_USER, UNSET_USER, UserActionTypes, SET_COURSES, SET_LOADING } from './types'
import { Course } from 'registrum-common/dist/lib/Banner'

// * Type for the AuthState
export interface AuthState {
    user: IUser | null
    loading: boolean
    courses: Course[]
}

// * Default values for the Auth reducer
const initialState: AuthState = {
    user: null,
    loading: false,
    courses: []
}

// * Changes state based on action type
export const AuthReducer = (state = initialState, action: UserActionTypes): AuthState => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload }
        case UNSET_USER:
            return { ...state, user: null }
        case SET_COURSES:
            return { ...state, courses: action.payload }
        case SET_LOADING:
            return { ...state, loading: action.payload }
        default:
            return state
    }
}
