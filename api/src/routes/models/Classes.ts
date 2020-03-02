import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// * typescript interface for class info
export interface Classes extends Document {
    subjectName: string;
    subjectClasses: string[];
    codeName: string;
}

// * Schema for user's info
const ClassSchema: Schema = new Schema({
    subjectName: { type: String, required: true, unique: true },
    subjectClasses: { type: Array, required: true },
    codeName:{ type: String, required: true, unique: true },
});

// Export the model
export default mongoose.model<Classes>('Classes', ClassSchema);