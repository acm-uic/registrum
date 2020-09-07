import { Schema } from 'mongoose';

export const HookSchema = new Schema({
  _id: String,
  urls: [String]
});
