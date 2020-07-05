import { IUser } from '../../interfaces/IUser'
import { SET_USER, UNSET_USER, UserActionTypes } from './types'

// * Type for the AuthState
export interface AuthState {
    user: IUser | null
    loading: boolean
}

// * Default values for the Auth reducer
const initialState: AuthState = {
    user: null,
    loading: false
}

// * Changes state based on action type
export const AuthReducer = (state = initialState, action: UserActionTypes): AuthState => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload }
        case UNSET_USER:
            return { ...state, user: null }
        default:
            return state
    }
}
