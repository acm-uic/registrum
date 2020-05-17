import Term from '@interfaces/Term'
import Subject from '@interfaces/Subject'
import Class from '@interfaces/Class'
import { BannerActionTypes, SET_TERMS, SET_SUBJECTS, ADD_CLASSES } from './types'

// * Type for the BannerState
export interface BannerState {
    terms: Term[]
    subjects: Subject[]
    classes: Class[]
}

// * Default values for the Banner reducer
const initialState: BannerState = {
    terms: [],
    subjects: [],
    classes: []
}

// * Changes state based on action type
export const BannerReducer = (state = initialState, action: BannerActionTypes) => {
    switch (action.type) {
        case SET_TERMS:
            return { ...state, terms: [...state.terms, ...action.payload] }
        case SET_SUBJECTS:
            return { ...state, subjects: [...state.subjects, ...action.payload] }
        case ADD_CLASSES:
            return { ...state, classes: [...state.classes, ...action.payload] }
        default:
            return state
    }
}
