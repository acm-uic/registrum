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
    courseNumbers: CourseNumber[]
    courses: Course[]
}

// * Default values for the Banner reducer
const initialState: BannerState = {
    terms: [],
    subjects: [],
    courseNumbers: [],
    courses: []
}

// * Changes state based on action type
export const BannerReducer = (state = initialState, action: BannerActionTypes): BannerState => {
    switch (action.type) {
        case ADD_TERMS:
            return { ...state, terms: action.payload }
        case ADD_SUBJECTS:
            return { ...state, subjects: action.payload }
        case ADD_COURSE_NUMBERS:
            return { ...state, courseNumbers: [...state.courseNumbers, ...action.payload] }
        case ADD_COURSES:
            return { ...state, courses: [...state.courses, ...action.payload] }
        default:
            return state
    }
}
