import { Subject as TSubject } from 'registrum-common/dist/lib/Banner'
import { SubjectSchema } from 'registrum-common/dist/schemas/Banner'
import { Document, model } from 'mongoose'

const Subject = model<TSubject & Document>('Subject', SubjectSchema)
export default Subject
