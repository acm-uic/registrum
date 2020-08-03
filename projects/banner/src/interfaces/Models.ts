import { Course, Subject, Term } from 'registrum-common/dist/lib/Banner';
import { CourseSchema, SubjectSchema, TermSchema } from 'registrum-common/dist/schemas/Banner';
import { Document, model } from 'mongoose';
export const TermModel = model<Term & Document>('Term', TermSchema);
export const SubjectModel = model<Subject & Document>('Subject', SubjectSchema);
export const CourseModel = model<Course & Document>('Course', CourseSchema);
