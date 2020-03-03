import { Reducer } from './reducer'

import { User } from '@interfaces/User'

const initialState: User = {
    firstname: null,
    lastname: null,
    classes: []
}

export const Auth: Reducer<User> = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_CLASSES':
            return { ...state, classes: action.payload }
        case 'ADD_CLASS':
            return { ...state, classes: [...state.classes, action.payload] }
        case 'REMOVE_CLASS':
            return { ...state, classes: action.payload.data }
        case 'UPDATE_USER':
        case 'LOGIN':
            return {
                firstname: action.payload.firstname,
                lastname: action.payload.lastname,
                classes: action.payload.classes
            }
        case 'LOGOUT':
            return { firstname: null, lastname: null, classes: [] }
        default:
            return state
    }
}
