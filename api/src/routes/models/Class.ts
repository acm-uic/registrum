import { Document, Schema, model } from 'mongoose'

// export interface IClass extends Document {
//     subject: string
//     CRN: string
//     title: string
//     courseNumber: number
//     instructor: string
//     creditHours: number
// }

// const ClassSchema: Schema = new Schema({
//     subject: {
//         type: String,
//         required: true
//     },
//     CRN: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     title: {
//         type: String,
//         required: true
//     },
//     courseNumber: {
//         type: Number,
//         required: true
//     },
//     instructor: String,
//     creditHours: Number
// })

export interface ClassObject extends Document {
    subject: string
    course: number
    id: string
}

const ClassSchema: Schema = new Schema({
    subject: String,
    course: Number,
    id: String
})

export default model<ClassObject>('Class', ClassSchema)
