import express from "express";
import { createClass, getClasses } from "../controllers/class.controller";
import { authorized } from "../middleware/auth.middleware";
import {
  assignStudentsToClass,
  assignPrincipalToClass,
  assignTeachersToClass,
} from "../controllers/class.controller";
import {getAttendance, updateAttendance, createAttendance, deleteAttendance, getAttendances} from "../controllers/attendance.controller"

const router = express.Router();

router.use(authorized);

router.post("/", createClass);
router.get("/", getClasses);

router.put("/:id/students", assignStudentsToClass);
router.put("/:id/teachers", assignTeachersToClass);
router.put("/:id/principal", assignPrincipalToClass);

// attendance
router.post("/:id/attendance", createAttendance);
router.get("/:id/attendance/", getAttendances); // get all
router.get("/:id/attendance/:atId", getAttendance); // get one
router.put("/:id/attendance/:atId", updateAttendance);
router.delete("/:id/attendance/:atId", deleteAttendance);

export default router;
