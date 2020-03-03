import { Reducer } from './reducer'

import { Class } from '../../interfaces/Class'

export interface AuthState {
    classes: Class[] | null
}

const initialState: AuthState = {
    classes: null
}

export const Auth: Reducer<AuthState> = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CLASSES':
            return { ...state, classes: action.payload }
        default:
            return state
    }
}
