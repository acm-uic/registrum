import { Document, Schema, model } from 'mongoose'

export interface IClass extends Document {
    subject: typeof Schema.Types.ObjectId
    CRN: string
    title: string
    courseNumber: number
    instructor: string
    creditHours: number
}

const ClassSchema: Schema = new Schema({
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    CRN: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    courseNumber: {
        type: Number,
        required: true
    },
    instructor: String,
    creditHours: Number
})

export default model<IClass>('Class', ClassSchema)
