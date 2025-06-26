import { Request, Response } from "express";
import {
  getAllStudentsService,
} from "../services/teacher.service";
import { getClassesService } from "../services/class.services";

export const getStudents = async (req: Request, res: Response) => {
  const students = await getAllStudentsService();
  res.json({ status: "success", data: students });
};

export const getClasses = async (req: Request, res: Response) => {
  const classes = await getClassesService(); 
  res.json({ status: "success", data: classes });
};
