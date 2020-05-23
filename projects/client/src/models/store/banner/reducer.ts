import Term from '@interfaces/Term'
import Subject from '@interfaces/Subject'
import Listing from '@interfaces/Listing'
import { BannerActionTypes, ADD_TERMS, ADD_SUBJECTS, ADD_LISTINGS, ADD_COURSES } from './types'
import Course from '@interfaces/Course'

// * Type for the BannerState
export interface BannerState {
    terms: Term[]
    subjects: Subject[]
    courses: Course[]
    listings: Listing[]
}

// * Default values for the Banner reducer
const initialState: BannerState = {
    terms: [],
    subjects: [],
    courses: [],
    listings: []
}

// * Changes state based on action type
export const BannerReducer = (state = initialState, action: BannerActionTypes) => {
    switch (action.type) {
        case ADD_TERMS:
            return { ...state, terms: [...state.terms, ...action.payload] }
        case ADD_SUBJECTS:
            return { ...state, subjects: [...state.subjects, ...action.payload] }
        case ADD_LISTINGS:
            return { ...state, listings: [...state.listings, ...action.payload] }
        case ADD_COURSES:
            return { ...state, courses: [...state.courses, ...action.payload] }
        default:
            return state
    }
}
