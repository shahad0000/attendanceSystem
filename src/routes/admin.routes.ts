import express from "express";
import {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  deleteAllUsers
} from "../controllers/admin.controller";
import { authorized } from '../middleware/auth.middleware';

import { createLeave, getLeave, updateLeave, deleteLeave } from "../controllers/leave.controller"

const router = express.Router();

router.use(authorized);

// CRUD for users
router.post("/users", createUser);         
router.get("/users", getUsers);            
router.put("/users/:id", updateUser); 
router.delete("/users/:id", deleteUser);   
router.delete("/users", deleteAllUsers);

router.post("/users/:id/leave/", createLeave); // upload leave  
router.get("/users/:id/leave/:leaveID", getLeave); 
router.put("/users/:id/leave/:leaveID", updateLeave); // accept or reject 
router.delete("/users/:id/leave/:leaveID", deleteLeave); 


export default router;
