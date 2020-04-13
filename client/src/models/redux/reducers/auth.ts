import { Reducer } from './reducer'

import { User } from '../../interfaces/User'

export interface AuthState {
    user: User | null
    loading: boolean
}

const initialState: AuthState = {
    user: null,
    loading: false
}

export const Auth: Reducer<AuthState> = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload }
        default:
            return state
    }
}
