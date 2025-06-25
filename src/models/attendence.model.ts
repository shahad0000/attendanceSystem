import { Schema, model, Document } from "mongoose";

// export interface ClassDocument extends Document {
//   name: string;
//   description: string;
//   location: string;
//   capacity: number;
//   dateStartAt: Date;
//   dateEndAt: Date;
//   timeStartAt: string;
//   timeEndAt: string;
//   students: Schema.Types.ObjectId[];
//   teachers: Schema.Types.ObjectId[];
//   principal?: Schema.Types.ObjectId;
// }

const attendenceSchema = new Schema(
  {
    classId: { type: String, required: true, unique: true },
    attendeeId: { type: String, required: true },
    attenderId: { type: String, required: true },
    attendeeAt: { type: Date, default: Date.now}
  },
  { timestamps: true }
);

export const AttendenceCollection = model("Attendence", attendenceSchema);
