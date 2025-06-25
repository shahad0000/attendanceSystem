import { Request, Response, NextFunction } from "express"; // Types from Express for typing request handlers
import { AuthRequest } from "../middleware/auth.middleware"; // custom request type that includes the authenticated user (req.user)

// Service functions for retrieving classes and creating a new class
import { getClassesService } from "../services/class.services";
import { createClassService } from "../services/admin.service";

// Functions that handle logic for assigning students, teachers, and principals to a class
import { assignStudentsService, assignTeachersService, assignPrincipalService } from "../services/class.services";

export const createClass = async (req: AuthRequest, res: Response) => {

  // only admin can create a class
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  try {
    const classData = req.body;

    const newClass = await createClassService(classData);

    res.status(201).json({ status: "success", data: newClass });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getClasses = async (req: Request, res: Response) => {
  const classes = await getClassesService();
  res.json({ status: "success", data: classes });
};

// Extracts the class ID from the URL (/class/:id/students) and the list of studentIds from the body
// Calls the service to update the class with the students
// Sends the updated class
export const assignStudentsToClass = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const classId = req.params.id;
    const { studentIds } = req.body;
    const updatedClass = await assignStudentsService(classId, studentIds);
    res.json({ status: "success", data: updatedClass });
  } catch (err) {
    next(err);
  }
};

// Similar to the previous function but for assigning teachers to a class
export const assignTeachersToClass = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const classId = req.params.id;
    const { teacherIds } = req.body;
    const updatedClass = await assignTeachersService(classId, teacherIds);
    res.json({ status: "success", data: updatedClass });
  } catch (err) {
    next(err);
  }
};

// Assigns or replaces the principal of a class using the principalId provided in the body
export const assignPrincipalToClass = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const classId = req.params.id;
    const { principalId } = req.body;
    const updatedClass = await assignPrincipalService(classId, principalId);
    res.json({ status: "success", data: updatedClass });
  } catch (err) {
    next(err);
  }
};