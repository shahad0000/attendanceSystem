import { Request, Response, NextFunction } from "express";
import {
  createParticipantService,
  getParticipantsService,
  getParticipantByIdService,
  updateParticipantService,
  deleteParticipantService,
} from "../services/participant.service";

export const createParticipant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { classId, userId } = req.body;
    const participant = await createParticipantService(classId, userId);
    res.status(201).json({ status: "success", data: participant });
  } catch (err) {
    next(err);
  }
};

export const getParticipants = async (req: Request, res: Response) => {
  const participants = await getParticipantsService();
  res.json({ status: "success", data: participants });
};

export const getParticipantById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const participant = await getParticipantByIdService(id);
  if (!participant) {
    res.status(404).json({ message: "Participant not found" });
    return;
  }

  res.json({ status: "success", data: participant });
};

export const updateParticipant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const participant = await updateParticipantService(id, updates);
  if (!participant) {
    res.status(404).json({ message: "Participant not found" });
    return;
  }

  res.json({ status: "success", data: participant });
};

export const deleteParticipant = async (req: Request, res: Response) => {
  const { id } = req.params;
  const participant = await deleteParticipantService(id);
  if (!participant) {
    res.status(404).json({ message: "Participant not found" });
    return;
  }
  res.json({ status: "success", message: "Participant deleted" });
};
