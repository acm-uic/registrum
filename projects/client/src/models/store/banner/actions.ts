import {
    BannerActionTypes,
    ADD_TERMS,
    ADD_SUBJECTS,
    ADD_LISTINGS,
    ADD_COURSES
} from '@redux/banner/types'
import Term from '@interfaces/Term'
import Listing from '@interfaces/Listing'
import Subject from '@interfaces/Subject'
import Course from '@interfaces/Course'

// * Populates the terms with the payload
export const setTerms = (terms: Term[]): BannerActionTypes => ({
    payload: terms,
    type: ADD_TERMS
})

// * Populates the subjects with the payload
export const setSubjects = (subjects: Subject[]): BannerActionTypes => ({
    type: ADD_SUBJECTS,
    payload: subjects
})

// * Populates the courses with the payload
export const addCourses = (courses: Course[]): BannerActionTypes => ({
    type: ADD_COURSES,
    payload: courses
})

// * Populates the listing with the payload
export const addListings = (listings: Listing[]): BannerActionTypes => ({
    type: ADD_LISTINGS,
    payload: listings
})
