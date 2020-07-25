import { BannerActionTypes, ADD_TERMS, ADD_SUBJECTS, ADD_COURSE_NUMBERS, ADD_COURSES } from './types';
import { Subject, Term, Course } from 'registrum-common/dist/lib/Banner';
import { CourseNumber } from '../../interfaces/CourseNumber';

// * Populates the terms with the payload
export const setTerms = (terms: Term[]): BannerActionTypes => ({
  payload: terms,
  type: ADD_TERMS
});

// * Populates the subjects with the payload
export const setSubjects = (subjects: Subject[]): BannerActionTypes => ({
  type: ADD_SUBJECTS,
  payload: subjects
});

export const addCourseNumbers = (course_numbers: CourseNumber[]): BannerActionTypes => ({
  type: ADD_COURSE_NUMBERS,
  payload: course_numbers
});

// * Populates the courses with the payload
export const addCourses = (courses: Course[]): BannerActionTypes => ({
  type: ADD_COURSES,
  payload: courses
});

// * Populates the listing with the payload
