import express from "express";
import {
  getTeachers,
  getStudents,
  getClasses,
} from "../controllers/principal.controller";
import { authorized, restrictTo } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authorized);
router.use(restrictTo("principal"));

router.get("/teachers", getTeachers);
router.get("/students", getStudents);
router.get("/class", getClasses);

export default router;
