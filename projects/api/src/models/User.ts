import { Document, Schema, model } from 'mongoose'
import * as mongoose from 'mongoose'

import Course from '../models/Course'

// * Interface for subscription object
export interface SubscriptionsObject extends Document {
    endpoint: string
    keys: {
        auth: string
        p256dh: string
    }
}

// * typescript interface for user info
export interface UserObject extends Document {
    firstname: string
    lastname: string
    email: string
    password: string
    subscriptions: string[]
    subscriptionObjects: SubscriptionsObject[]
    emailNotificationsEnabled: boolean
    pushNotificationsEnabled: boolean
}

// * Schema for user's info
const UserSchema: Schema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscriptions: [
        {
            type: mongoose.Schema.Types.String,
            ref: Course
        }
    ],
    subscriptionObjects: [
        {
            endpoint: String,
            expirationTime: String,
            keys: {
                p256dh: String,
                auth: String
            }
        }
    ],
    emailNotificationsEnabled: { type: Boolean, default: true },
    pushNotificationsEnabled: { type: Boolean, default: true }
})

// Export the model
const User = model<UserObject>('User', UserSchema)
export default User
