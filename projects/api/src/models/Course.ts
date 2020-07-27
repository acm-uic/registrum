import { Course } from 'registrum-common/dist/lib/Banner'
import { CourseSchema } from 'registrum-common/dist/schemas/Banner'
import { Document, model } from 'mongoose'

export default model<Course & Document>('Course', CourseSchema)
