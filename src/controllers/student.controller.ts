import { getAllStudentsService } from "../services/principal.service";
import { Request, Response, NextFunction } from "express";
import { LeaveCollection } from "../models/leave.model"

export const getReport = async (req: Request, res: Response) => {

    const { id } = req.params

    const studentLeaves = await LeaveCollection.find({studentId: id}).populate({path: "classId", select: ["-_id", "-createdAt", "-updatedAt", "-__v"]}).select(["-_id", "-__v", "-createdAt", "-updatedAt"])

    res.json({ status: "success", studentLeaves: studentLeaves });

};