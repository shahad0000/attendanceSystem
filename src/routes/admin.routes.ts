import express from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  deleteAllUsers,
  getReports
} from "../controllers/admin.controller";
import { authorized } from '../middleware/auth.middleware';

import { createLeave, getLeave, updateLeave, deleteLeave, getLeaves } from "../controllers/leave.controller"

const router = express.Router();

router.use(authorized);

// CRUD for users
router.post("/users", createUser);         
router.get("/users", getUsers);            
router.put("/users/:id", updateUser); 
router.delete("/users/:id", deleteUser);   
router.delete("/users", deleteAllUsers);

// leaves
router.post("/users/:id/leave/", createLeave); // upload leave
router.get("/users/:id/leave/", getLeaves); // get all  
router.get("/users/:id/leave/:leaveID", getLeave); // get one
router.put("/users/:id/leave/:leaveID", updateLeave); // accept or reject 
router.delete("/users/:id/leave/:leaveID", deleteLeave);

// // reports
// router.get("/reports", getReports);


export default router;
