import { Request, Response } from "express";
import {
  getAllTeachersService,
  getAllStudentsService,
} from "../services/principal.service";
import { getClassesService } from "../services/class.services";

export const getTeachers = async (req: Request, res: Response) => {
  const teachers = await getAllTeachersService();
  res.json({ status: "success", data: teachers });
};

export const getStudents = async (req: Request, res: Response) => {
  const students = await getAllStudentsService();
  res.json({ status: "success", data: students });
};

export const getClasses = async (req: Request, res: Response) => {
  const classes = await getClassesService(); 
  res.json({ status: "success", data: classes });
};
