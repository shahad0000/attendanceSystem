import express from "express";
import { createClass, getClasses } from "../controllers/class.controller";
import { authorized } from "../middleware/auth.middleware";
import {
  assignStudentsToClass,
  assignPrincipalToClass,
  assignTeachersToClass,
} from "../controllers/class.controller";

const router = express.Router();

router.use(authorized);

router.post("/", createClass);
router.get("/", getClasses);

router.put("/:id/students", assignStudentsToClass);
router.put("/:id/teachers", assignTeachersToClass);
router.put("/:id/principal", assignPrincipalToClass);

export default router;
