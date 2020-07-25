import axios from 'axios';

import { AppThunk } from '../store';
import { setTerms, setSubjects, addCourses, addCourseNumbers } from './actions';
import { Subject, Term, Course } from 'registrum-common/dist/lib/Banner';
import { GetCoursesProps, GetCourseNumbersProps } from './types';
import { CourseNumber } from '../../interfaces/CourseNumber';

// * Setting the path for the api calls
const basePath = process.env.API_BASE_PATH || '/api';
const baseURL = `${basePath}/`;

// * Single axios client for configurations
export const client = axios.create({
  baseURL,
  validateStatus: () => true
});

export const getTerms = (): AppThunk => async (dispatch, getState) => {
  const { terms } = getState().banner;

  // * Term have already been pulled
  if (terms.length > 0) return;

  try {
    const response = await client.get('classes/terms');

    if (response.status === 200) {
      // * Destructure response from API
      const terms = response.data as Term[];

      // * Add the terms into the banner state
      dispatch(setTerms(terms));
    }
  } catch (err) {
    // * Log the error message
    console.error(err.message);

    // toast('🚨 Could not connect to the API', { type: 'error' })
  }
};

export const getSubjects = (): AppThunk => async (dispatch, getState) => {
  const { subjects } = getState().banner;

  // * Term have already been pulled
  if (subjects.length > 0) return;

  try {
    const response = await client.get('classes/subjects');

    if (response.status === 200) {
      // * Destructure response from API
      const subjects = response.data as Subject[];

      // * Add the subjects into the banner state
      dispatch(setSubjects(subjects));
    }
  } catch (err) {
    // * Log the error message
    console.error(err.message);

    // toast('🚨 Could not connect to the API', { type: 'error' })
  }
};

export const getCourseNumbers = (data: GetCourseNumbersProps): AppThunk => async (dispatch, getState) => {
  // * Destructure data to get relevant info
  const { term, subject } = data;
  const { terms, subjects, courseNumbers } = getState().banner;

  // * Check for bad terms or subjects
  const isTermValid = terms.find(t => t.code == term.toString()) !== undefined;
  const isSubjectValid = subjects.find(s => s.code == subject) !== undefined;
  if (!isSubjectValid || !isTermValid) return;

  // * Check if the query has been already made and return if yes
  const courseNumbersExist = courseNumbers.filter(c => c.subject == subject && c.term === term).length > 0;
  if (courseNumbersExist) return;

  try {
    const response = await client.get(`classes/list/${term}/${subject}`);

    if (response.status === 200) {
      // * Parse the response into objects
      const parsed: CourseNumber[] = (response.data as string[]).map(
        num => new CourseNumber(term, subject, parseInt(num))
      );

      dispatch(addCourseNumbers(parsed));
    }
  } catch (err) {
    // * Log the error message
    console.error(err.message);

    // toast('🚨 Could not connect to the API', { type: 'error' })
  }
};

export const getCourses = (data: GetCoursesProps): AppThunk => async (dispatch, getState) => {
  // * Destructure data to get relevant info
  const { term, subject, courseNumber } = data;
  const { terms, subjects, courses, courseNumbers } = getState().banner;

  // // * Check for bad terms or subjects
  // const isTermValid = terms.find(t => t.code == term.toString())
  // const isSubjectValid = subjects.find(s => s.code == subject)
  // const isCourseNumberValid = courseNumbers.find(
  //     c => c.number === courseNumber && c.subject == subject && c.term === term
  // )
  // if (!isSubjectValid || !isTermValid || !isCourseNumberValid) return

  // // * Check if the query has been already made and return if yes
  // const coursesExist =
  //     courses.filter(
  //         l =>
  //             l.subject === subject &&
  //             l.term === isTermValid.description &&
  //             l.courseNumber === courseNumber.toString()
  //     ).length > 0
  // if (coursesExist) return

  try {
    const response = await client.get(`classes/listing/${term}/${subject}/${courseNumber}`);

    if (response.status === 200) {
      const parsed = response.data as Course[];

      dispatch(addCourses(parsed));
    }
  } catch (err) {
    // * Log the error message
    console.error(err.message);

    // toast('🚨 Could not connect to the API', { type: 'error' })
  }
};
