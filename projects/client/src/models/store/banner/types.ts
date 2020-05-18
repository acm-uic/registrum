import { Action } from 'redux'
import Term from '@interfaces/Term'
import Subject from '@interfaces/Subject'
import Class from '@interfaces/Class'

export const SET_TERMS = 'SET_TERMS'
export const SET_SUBJECTS = 'SET_SUBJECTS'
export const ADD_CLASSES = 'ADD_CLASSES'

// * Populates the terms array
interface SetTermsAction extends Action {
    type: typeof SET_TERMS
    payload: Term[]
}

// * Populates the subject array
interface SetSubjectsAction extends Action {
    type: typeof SET_SUBJECTS
    payload: Subject[]
}

// * Add classes to redux
interface AddClassesAction extends Action {
    type: typeof ADD_CLASSES
    payload: Class[]
}

// * Cummalative Type
export type BannerActionTypes = SetTermsAction | SetSubjectsAction | AddClassesAction
