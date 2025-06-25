import { Request, Response, NextFunction } from "express";
import { AttendenceCollection } from "../models/attendence.model"

export const createAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const attendance = await AttendenceCollection.create(req.body)

    res.status(201).json({ status: "success", data: { attendance } });

  } catch (error) {
    console.error("getAttendance ERROR:", error);
    next(error);
  }
};

export const updateAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {

      const  id = req.params.atId;

      const updates = req.body;
    
      const attendance = await AttendenceCollection.findByIdAndUpdate(id, updates, { new: true });
      if (!attendance) {
        res.status(404).json({ message: "attendance not found" });
        return;
      }
    
      res.json({ status: "success", data: { attendance } });

  } catch (error) {
    console.error("updateAttendance ERROR:", error);
    next(error);
  }
};

export const getAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {

      const  id = req.params.atId;
    
      const attendance = await AttendenceCollection.findOne({ _id: id});

      if (!attendance) {
        res.status(404).json({ message: "attendance not found" });
        return;
      }
    
      res.json({ status: "success", data: { attendance } });

  } catch (error) {
    console.error("getAttendance ERROR:", error);
    next(error);
  }
};

export const deleteAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {

      const  id  = req.params.atId;
    
      const attendance = await AttendenceCollection.findByIdAndDelete(id);

      if (!attendance) {
        res.status(404).json({ message: "attendance not found" });
        return;
      }
    
      res.json({ status: "success", message: "attendance deleted" });

  } catch (error) {
    console.error("deleteAttendance ERROR:", error);
    next(error);
  }
};