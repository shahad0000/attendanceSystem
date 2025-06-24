import express from "express";
import { createClass, getClasses } from "../controllers/class.controller";
import { authorized } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authorized); 

router.post("/", createClass);     
router.get("/", getClasses);        

export default router;
