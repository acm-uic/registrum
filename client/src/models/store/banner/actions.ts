import { BannerActionTypes, SET_TERMS, SET_SUBJECTS, ADD_CLASSES } from '@redux/banner/types'
import Term from '@interfaces/Term'
import Class from '@interfaces/Class'
import Subject from '@interfaces/Subject'

// * Populates the term with the payload
export const setUser = (terms: Term[]): BannerActionTypes => ({
    payload: terms,
    type: SET_TERMS
})

// * No payload needed since it will be set to null
export const unsetUser = (subjects: Subject[]): BannerActionTypes => ({
    type: SET_SUBJECTS,
    payload: subjects
})

// * Add a class to the user
export const addClass = (cls: Class[]): BannerActionTypes => ({
    type: ADD_CLASSES,
    payload: cls
})
