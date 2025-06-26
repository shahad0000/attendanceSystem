import { Schema, model, Document } from "mongoose";

const leaveSchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leavedAt: { type: Date, default: Date.now },
    leaveType: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      default: "pending",
      required: true,
    },

    acceptedBy: { type: Schema.Types.ObjectId },
    acceptedAt: { type: Date },
    rejectedBy: { type: Schema.Types.ObjectId },
    rejectedAt: { type: Date },
  },
  { timestamps: true }
);

export const LeaveCollection = model("Leave", leaveSchema);
