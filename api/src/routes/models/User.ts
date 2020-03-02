import { Document, Schema, model } from 'mongoose'

const ObjectID = require('mongoose')

// * typescript interface for user info
export interface IUser extends Document {
    email: string
    password: string
    classes: typeof Schema.Types.ObjectId[]
}

// * Schema for user's info
const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    classes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Class'
        }
    ]
})

// Export the model
export default model<IUser>('User', UserSchema)
