import { Participant } from "../models/participant.model";

export const createParticipantService = async (classId: string, userId: string) => {
  const participant = await Participant.create({ classId, userId });
  return participant;
};

export const getParticipantsService = async () => {
  return await Participant.find().populate("classId").populate("userId");
};

export const getParticipantByIdService = async (id: string) => {
  return await Participant.findById(id).populate("classId").populate("userId");
};

export const updateParticipantService = async (
  id: string,
  updates: Partial<{ classId: string; userId: string }>
) => {
  const participant = await Participant.findByIdAndUpdate(id, updates, { new: true });
  return participant;
};

export const deleteParticipantService = async (id: string) => {
  return await Participant.findByIdAndDelete(id);
};
