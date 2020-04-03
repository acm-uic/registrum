import { Document, Schema, model } from "mongoose";

// * Class Subscription Interface
export interface ClassSubscription {
  crn: string;
}

// * typescript interface for user info
export interface UserObject extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  subscriptions: string[];
}

// * Schema for user's info
const UserSchema: Schema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptions: [String],
});

// Export the model
export default model<UserObject>("User", UserSchema);
