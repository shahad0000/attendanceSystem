import { ClassCollection } from "../models/class.model";

export const assignStudentsService = async (classId: string, studentIds: string[]) => {
  return await ClassCollection.findByIdAndUpdate(
    classId,
    { $addToSet: { students: { $each: studentIds } } },
    { new: true }
  );
};

export const assignTeachersService = async (classId: string, teacherIds: string[]) => {
  return await ClassCollection.findByIdAndUpdate(
    classId,
    { $addToSet: { teachers: { $each: teacherIds } } },
    { new: true }
  );
};

export const assignPrincipalService = async (classId: string, principalId: string) => {
  return await ClassCollection.findByIdAndUpdate(
    classId,
    { principal: principalId },
    { new: true }
  );
};


// Get all classes
export const getClassesService = async () => {
  return await ClassCollection.find({});
};
