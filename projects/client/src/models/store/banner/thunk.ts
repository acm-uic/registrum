import axios from 'axios'
import { toast } from 'react-toastify'

import { AppThunk } from '@redux/.'
import { setTerms, setSubjects, addCourses, addListings } from '@redux/banner/actions'
import Term from '@interfaces/Term'
import Subject from '@interfaces/Subject'
import Course from '@interfaces/Course'
import { GetListingsProps, GetCoursesProps } from './types'
import Listing from '@interfaces/Listing'

// * Setting the path for the api calls
const basePath = process.env.API_BASE_PATH || '/api'
const URL = `${basePath}/`

// * Single axios client for configurations
export const client = axios.create({
    baseURL: URL,
    validateStatus: () => true
})

export const getTerm = (): AppThunk => async (dispatch, getState) => {
    const { terms } = getState().banner

    // * Term have already been pulled
    if (terms.length > 0) return

    try {
        const response = await axios.get('/classes/terms')

        if (response.status === 200) {
            // * Destructure response from API
            const terms = response.data as Term[]

            // * Add the terms into the banner state
            dispatch(setTerms(terms))
        }
    } catch (err) {
        // * Log the error message
        console.error(err.message)

        toast('🚨 Could not connect to the API', { type: 'error' })
    }
}

export const getSubjects = (): AppThunk => async (dispatch, getState) => {
    const { terms } = getState().banner

    // * Term have already been pulled
    if (terms.length > 0) return

    try {
        const response = await axios.get('/classes/subjects')

        if (response.status === 200) {
            // * Destructure response from API
            const subjects = response.data as Subject[]

            // * Add the subjects into the banner state
            dispatch(setSubjects(subjects))
        }
    } catch (err) {
        // * Log the error message
        console.error(err.message)

        toast('🚨 Could not connect to the API', { type: 'error' })
    }
}

export const getCourses = (data: GetCoursesProps): AppThunk => async (dispatch, getState) => {
    // * Destructure data to get relevent info
    const { term, subject } = data
    const { terms, subjects, courses } = getState().banner

    // * Check for bad terms or subjects
    const isTermValid = terms.find(t => t.code === term) !== undefined
    const isSubjectValid = subjects.find(s => s.code === subject) !== undefined
    if (!isSubjectValid || !isTermValid) return

    // * Check if the query has been already made and return if yes
    const coursesExist = courses.filter(c => c.subject === subject && c.term === term).length > 0
    if (coursesExist) return

    try {
        const response = await client.get(`/classes/list/${term}/${subject}`)

        if (response.status === 200) {
            // * Parse the response into objects
            const parsed: Course[] = (response.data as string[]).map(
                num => new Course(term, subject, parseInt(num))
            )

            dispatch(addCourses(parsed))
        }
    } catch (err) {
        // * Log the error message
        console.error(err.message)

        toast('🚨 Could not connect to the API', { type: 'error' })
    }
}

export const getListings = (data: GetListingsProps): AppThunk => async (dispatch, getState) => {
    // * Destructure data to get relevent info
    const { term, subject, course } = data
    const { terms, subjects, courses, listings } = getState().banner

    // * Check for bad terms or subjects
    const isTermValid = terms.find(t => t.code === term)
    const isSubjectValid = subjects.find(s => s.code === subject)
    const isCourseValid = courses.find(
        c => c.number === course && c.subject === subject && c.term === term
    )
    if (!isSubjectValid || !isTermValid || !isCourseValid) return

    // * Check if the query has been already made and return if yes
    const listingsExist =
        listings.filter(
            l =>
                l.subject === subject &&
                l.term === isTermValid.description &&
                l.courseNumber === course.toString()
        ).length > 0
    if (listingsExist) return

    try {
        const response = await client.get(`/classes/listing/${term}/${subject}/${course}`)

        if (response.status === 200) {
            const parsed = response.data as Listing[]

            dispatch(addListings(parsed))
        }
    } catch (err) {
        // * Log the error message
        console.error(err.message)

        toast('🚨 Could not connect to the API', { type: 'error' })
    }
}
