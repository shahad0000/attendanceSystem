import { Schema, model, Document } from "mongoose";

export interface ClassDocument extends Document {
  name: string;
  description: string;
  location: string;
  capacity: number;
  dateStartAt: Date;
  dateEndAt: Date;
  timeStartAt: string; 
  timeEndAt: string;   
}

const classSchema = new Schema<ClassDocument>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    dateStartAt: { type: Date, required: true },
    dateEndAt: { type: Date, required: true },
    timeStartAt: { type: String, required: true }, 
    timeEndAt: { type: String, required: true },   
  },
  { timestamps: true }
);

export const ClassCollection = model<ClassDocument>("Class", classSchema);
