import { Schema, model, Types, Document } from "mongoose";

export interface ParticipantDocument extends Document {
  classId: Types.ObjectId;
  userId: Types.ObjectId;
}

const participantSchema = new Schema<ParticipantDocument>(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Participant = model<ParticipantDocument>("Participant", participantSchema);
