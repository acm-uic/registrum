import { Document, Schema, model } from 'mongoose'

// * typescript interface for subscription object
export interface SubscriptionsObject extends Document {
    subscriptions: JSON[]
}

// * Schema for subscriptions
const SubscriptionsModel: Schema = new Schema({
    subscriptions: [JSON]
})

// Export the model
export default model<SubscriptionsObject>('SubscriptionsModel', SubscriptionsModel)
