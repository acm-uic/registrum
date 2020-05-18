import { Document, Schema, model } from 'mongoose'

// * Class Subscription Interface
export interface ClassSubscription {
    crn: string
}

// * typescript interface for subscription object
// fixme: trying to make an array of these won't work
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
    subscriptions: [String],
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
export default model<UserObject>('User', UserSchema)
