import { Request, Response } from "express";
import { AuthRequest } from "@/middleware/auth.middleware";
import {
  createClassService,
  getClassesService,
} from "../services/class.services";

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
