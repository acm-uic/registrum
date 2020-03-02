import { Document, Schema, model } from 'mongoose'

// * typescript interface for user info
export interface IUser extends Document {
    email: string
    password: string
    listOfClasses: string[]
}

// * Schema for user's info
const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    listOfClasses: { type: Array, required: true }
})

// Export the model
export default model<IUser>('User', UserSchema)
