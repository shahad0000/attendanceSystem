import { ClassCollection } from "../models/class.model";

// Create a class
export const createClassService = async (data: {
  name: string;
  description: string;
  location: string;
  capacity: number;
  dateStartAt: string;
  dateEndAt: string;
  timeStartAt: string;
  timeEndAt: string;
}) => {
  return await ClassCollection.create({
    ...data,
    dateStartAt: new Date(data.dateStartAt),
    dateEndAt: new Date(data.dateEndAt),
  });
};

// Get all classes
export const getClassesService = async () => {
  return await ClassCollection.find({});
};
