import express from "express";
import {
  createParticipant,
  getParticipants,
  getParticipantById,
  updateParticipant,
  deleteParticipant,
} from "../controllers/participant.controller";

const router = express.Router();

router.post("/", createParticipant);
router.get("/", getParticipants);
router.get("/:id", getParticipantById);
router.put("/:id", updateParticipant);
router.delete("/:id", deleteParticipant);

export default router;
