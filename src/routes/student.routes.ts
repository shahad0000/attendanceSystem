import express from "express";
import { getReport } from "../controllers/student.controller"

const router = express.Router();

router.get("/report/:id", getReport)

export default router;
