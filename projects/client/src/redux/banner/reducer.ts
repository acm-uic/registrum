import { Subject, Term, Course } from 'registrum-common/dist/lib/Banner'
import {
    BannerActionTypes,
    ADD_TERMS,
    ADD_SUBJECTS,
    ADD_COURSE_NUMBERS,
    ADD_COURSES
} from './types'
import { CourseNumber } from '../../interfaces/CourseNumber'

// * Type for the BannerState
export interface BannerState {
    terms: Term[]
    subjects: Subject[]
    courses: Course[]
    courseNumbers: CourseNumber[]
}

// * Default values for the Banner reducer
const initialState: BannerState = {
    terms: [],
    subjects: [],
    courses: [],
    courseNumbers: []
}

// * Changes state based on action type
export const BannerReducer = (state = initialState, action: BannerActionTypes): BannerState => {
    switch (action.type) {
        case ADD_TERMS:
            return { ...state, terms: [...state.terms, ...action.payload] }
        case ADD_SUBJECTS:
            return { ...state, subjects: [...state.subjects, ...action.payload] }
        case ADD_COURSE_NUMBERS:
            return { ...state, courseNumbers: [...state.courseNumbers, ...action.payload] }
        case ADD_COURSES:
            return { ...state, courses: [...state.courses, ...action.payload] }
        default:
            return state
    }
}
