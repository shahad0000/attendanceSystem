import { getAllStudentsService } from "../services/principal.service";
import { Request, Response, NextFunction } from "express";
import { LeaveCollection } from "../models/leave.model"

export const getReport = async (req: Request, res: Response) => {

    const { id } = req.params

    console.log(id)

    const studentLeaves = await LeaveCollection.find({studentId: id});

    console.log(getReport)

    res.json({ status: "success", studentLeaves: studentLeaves });

};