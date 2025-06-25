import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { getClassesService } from "../services/class.services";
import { createClassService } from "../services/admin.service";
import { assignStudentsService, assignTeachersService, assignPrincipalService } from "../services/class.services";

export const createClass = async (req: AuthRequest, res: Response) => {
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