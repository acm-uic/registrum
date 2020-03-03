import { Document, Schema, model } from 'mongoose'

const ObjectID = require('mongoose')

// * typescript interface for user info
export interface IUser extends Document {
    firstname: string
    lastname: string
    email: string
    password: string
    classes: typeof Schema.Types.ObjectId[]
}

// * Schema for user's info
const UserSchema: Schema = new Schema({
    firstname: { type: String, required: true, unique: true },
    lastname: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    classes: [
        // {
        //     type: Schema.Types.ObjectId,
        //     ref: 'Class'
        // }
        {
            subject: String,
            number: Number
        }
    ]
})

// Export the model
export default model<IUser>('User', UserSchema)
