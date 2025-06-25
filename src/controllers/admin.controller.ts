import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.middleware"; // Custom Request interface that includes user (injected by the authorized middleware)

// Imports business logic from the service layer
import {
  createUserService,
  getUsersService,
  updateUserService,
  deleteUserService,
} from "../services/admin.service";

// Defines the createUser controller using the AuthRequest to access the authenticated admin
export const createUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {

  // Checks if the authenticated user is not an admin. If not, return a 403 Forbidden
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  try {
    const { name, email, password, role } = req.body;

    // Call the service function to handle the actual database creation logic
    const user = await createUserService({ name, email, password, role });

    // Returns a 201 Created response with the new user
    res.status(201).json({ status: "success", data: { user } });

    return;
  } catch (err: any) {
    // Catches any thrown error and passes it to Express error middleware
    next(err);
  }
};

// get users by role
export const getUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {

  const users = await getUsersService();

  res.json({ status: "success", data: users });
  return;
};

// update users
export const updateUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {

  const { id } = req.params;
  // update fields
  const updates = req.body;

  const user = await updateUserService(id, updates);
  
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({ status: "success", data: { user } });
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await deleteUserService(id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({ status: "success", message: "User deleted" });
  return;
};
