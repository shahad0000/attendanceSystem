import { UsersCollection } from "../models/user.model";

export const getAllStudentsService = async () => {
  return UsersCollection.find({ role: "student" });
};

