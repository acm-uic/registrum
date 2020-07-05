import { Action } from 'redux'
import { Subject, Term, Course } from 'registrum-common/dist/lib/Banner'
import { CourseNumber } from '../../interfaces/CourseNumber'
export const ADD_TERMS = 'SET_TERMS'
export const ADD_SUBJECTS = 'SET_SUBJECTS'
export const ADD_COURSES = 'ADD_COURSES'
export const ADD_COURSE_NUMBERS = 'ADD_COURSE_NUMBERS'

// * Populates the terms array
interface SetTermsAction extends Action {
    type: typeof ADD_TERMS
    payload: Term[]
}

// * Populates the subject array
interface SetSubjectsAction extends Action {
    type: typeof ADD_SUBJECTS
    payload: Subject[]
}

// * Add courses to redux
interface AddCoursesAction extends Action {
    type: typeof ADD_COURSES
    payload: Course[]
}

// * Add listings to redux
interface AddListingsAction extends Action {
    type: typeof ADD_COURSE_NUMBERS
    payload: CourseNumber[]
}

// * Cumulative Type
export type BannerActionTypes =
    | SetTermsAction
    | SetSubjectsAction
    | AddCoursesAction
    | AddListingsAction

// * Data needed to get current courses
export interface GetCoursesProps {
    term: number
    subject: string
}

// * Data needed for get relevant classes
export interface GetListingsProps {
    term: number
    subject: string
    course: number
}
