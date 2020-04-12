import { Course, Subject, Term } from '../lib/Banner'
import { CourseSchema, SubjectSchema, TermSchema } from './Schemas'
import { Document, model } from 'mongoose'
export const TermModel = model<Term & Document>('Term', TermSchema)
export const SubjectModel = model<Subject & Document>('Subject', SubjectSchema)
export const CourseModel = model<Course & Document>('Course', CourseSchema)
