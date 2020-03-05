import { Reducer } from './reducer'

import { User } from '@interfaces/User'

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
        case 'SIGN_IN':
            return { ...state, user: action.payload.user as User, error: action.payload.error }
        default:
            return state
    }
}
