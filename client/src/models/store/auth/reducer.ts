import User from '@interfaces/User'
import { SET_USER, UNSET_USER, UserActionTypes } from '@redux/auth/types'

// * Type for the AuthState
export interface AuthState {
    user: User | null
    loading: boolean
}

// * Default values for the Auth reducer
const initialState: AuthState = {
    user: null,
    loading: false
}

// * Changes state based on action type
export const AuthReducer = (state = initialState, action: UserActionTypes) => {
    switch (action.type) {
        case SET_USER:
            return { ...state, user: action.payload }
        case UNSET_USER:
            return { ...state, user: null }
        default:
            return state
    }
}
