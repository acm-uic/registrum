import { Reducer } from './reducer'

import { User } from '../../interfaces/User'
import { toast } from 'react-toastify'

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
        case 'SIGN_UP':
            if (action.payload.msg) {
                const { msg, options } = action.payload.msg
                toast(msg, options)
            }

            return { ...state, user: action.payload.user as User }
        case 'SIGN_IN':
            if (action.payload.msg) {
                const { msg, options } = action.payload.msg
                toast(msg, options)
            }
            return { ...state, user: action.payload.user as User }
        case 'SIGN_OUT':
            if (action.payload.msg) {
                const { msg, options } = action.payload.msg
                toast(msg, options)
            }
            return { ...state, user: null }
        case 'ADD_CLASS':
            if (action.payload.msg) {
                const { msg, options } = action.payload.msg
                toast(msg, options)
            }

            if (state.user !== null && action.payload.cls !== null)
                return {
                    ...state,
                    user: { ...state.user, classes: action.payload.cls }
                }
            else return state
        case 'REMOVE_CLASS':
            if (action.payload.msg) {
                const { msg, options } = action.payload.msg
                toast(msg, options)
            }

            if (state.user !== null && action.payload.cls !== null)
                return {
                    ...state,
                    user: {
                        ...state.user,
                        classes: action.payload.cls
                    }
                }
            else return state
        default:
            return state
    }
}
