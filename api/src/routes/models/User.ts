import { Document, Schema, model } from 'mongoose'
import Class from './Class'

const ObjectID = require('mongoose')

// * typescript interface for user info
export interface UserObject extends Document {
    firstname: string
    lastname: string
    email: string
    password: string
    classes: typeof Class
}

// * Schema for user's info
const UserSchema: Schema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    classes: [
        {
            subject: String,
            number: Number
        }
    ]
})

// Export the model
export default model<UserObject>('User', UserSchema)
