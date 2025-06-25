import { Schema, model } from "mongoose";

const attendenceSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    attendeeId: { type: Schema.Types.ObjectId, required: true },
    attenderId: { type: Schema.Types.ObjectId, required: true },
    attendeeAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const AttendenceCollection = model("Attendence", attendenceSchema);
