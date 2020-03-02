import { Document, Schema, model } from 'mongoose'

// * typescript interface for class info
export interface ISubject extends Document {
    subjectName: string
    codeName: string
    classes: typeof Schema.Types.ObjectId[]
}

// * Schema for user's info
const SubjectSchema: Schema = new Schema({
    subjectName: { type: String, required: true, unique: true },
    codeName: { type: String, required: true, unique: true },
    classes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Class'
        }
    ]
})

// Export the model
export default model<ISubject>('Subject', SubjectSchema)
