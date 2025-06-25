import { Request, Response, NextFunction } from "express";
import { LeaveCollection } from "../models/leave.model"

export const createLeave = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const leave = await LeaveCollection.create(req.body)

    res.status(201).json({ status: "success", data: { leave } });

  } catch (error) {
    console.error("createLeave ERROR:", error);
    next(error);
  }
};

export const updateLeave = async (req: Request, res: Response, next: NextFunction) => {
  try {

      const  id = req.params.leaveID;

      const updates = req.body;
    
      const leave = await LeaveCollection.findByIdAndUpdate(id, updates, { new: true });
      if (!leave) {
        res.status(404).json({ message: "User not found" });
        return;
      }
    
      res.json({ status: "success", data: { leave: leave } });

  } catch (error) {
    console.error("updateLeave ERROR:", error);
    next(error);
  }
};

export const getLeave = async (req: Request, res: Response, next: NextFunction) => {
  try {

      const  id = req.params.leaveID;
    
      const leave = await LeaveCollection.findOne({ _id: id});

      if (!leave) {
        res.status(404).json({ message: "leave not found" });
        return;
      }
    
      res.json({ status: "success", data: { leave: leave } });

  } catch (error) {
    console.error("getLeave ERROR:", error);
    next(error);
  }
};

export const deleteLeave = async (req: Request, res: Response, next: NextFunction) => {
  try {

      const  id  = req.params.leaveID;
    
      const leave = await LeaveCollection.findByIdAndDelete(id);

      if (!leave) {
        res.status(404).json({ message: "leave not found" });
        return;
      }
    
      res.json({ status: "success", message: "leave deleted" });

  } catch (error) {
    console.error("deleteLeave ERROR:", error);
    next(error);
  }
};