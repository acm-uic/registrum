import { Reducer } from './reducer'

import { User } from '../../interfaces/User'

export interface AuthState {
    user: User | null
    loading: boolean
    error: string
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: ''
}

export const Auth: Reducer<AuthState> = (state = initialState, action) => {
    switch (action.type) {
        case 'SIGN_UP':
            return { ...state, user: action.payload.user as User, error: action.payload.error }
        case 'SIGN_IN':
            return { ...state, user: action.payload.user as User, error: action.payload.error }
        case 'SIGN_OUT':
            return { ...state, user: null, error: action.payload }
        case 'ADD_CLASS':
            if (state.user !== null && action.payload.cls !== null)
                return {
                    ...state,
                    user: { ...state.user, classes: [...state.user.classes, action.payload.cls] },
                    error: action.payload.error
                }
            else return { ...state, error: action.payload.error }
        case 'REMOVE_CLASS':
            if (state.user !== null && action.payload._id !== null)
                return {
                    ...state,
                    user: {
                        ...state.user,
                        classes: state.user.classes.filter(cls => cls._id !== action.payload._id)
                    },
                    error: action.payload.error
                }
            else return { ...state, error: action.payload.error }
        default:
            return state
    }
}
