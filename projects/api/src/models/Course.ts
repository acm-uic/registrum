import { Course as TCourse } from 'registrum-common/dist/lib/Banner'
import { CourseSchema } from 'registrum-common/dist/schemas/Banner'
import { Document, model } from 'mongoose'

const Course = model<TCourse & Document>('Course', CourseSchema)
export default Course
