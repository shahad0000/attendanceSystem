import { UsersCollection } from "../models/user.model";

export const getAllTeachersService = async () => {
  return UsersCollection.find({ role: "teacher" });
};

export const getAllStudentsService = async () => {
  return UsersCollection.find({ role: "student" });
};

