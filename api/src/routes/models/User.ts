import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// * typescript interface for user info
export interface User extends Document {
    email: string;
    password: string;
    listOfClasses: string[]
}

// * Schema for user's info
const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    listOfClasses: { type: Array, required: true }
});

// Export the model
export default mongoose.model<User>('User', UserSchema);