import express from "express";
import {
  getStudents,
  getClasses,
} from "../controllers/teacher.controller";
import { authorized, restrictTo } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authorized);
router.use(restrictTo("teacher"));

router.get("/students", getStudents);
router.get("/class", getClasses);

export default router;
