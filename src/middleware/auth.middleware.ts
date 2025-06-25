import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UsersCollection } from "../models/user.model";
import { jwtConfig } from "../config/jwt";
import { AppError } from "../utils/error";
import { FORBIDDEN, UNAUTHORIZED } from "../utils/http-status";

export interface AuthRequest extends Request {
  user?: any;
}

// Middleware that ensures the request has a valid access token
// Enhances the request with a user object if the token is valid
export const authorized = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {

    // 1) Get token from header
    const authHeader = req.headers.authorization;
    let token: string | undefined;


    // Looks for a token in:
    // Authorization: Bearer <token>
    // or accessToken cookie (supports web clients storing tokens in cookies)
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // Throws 401 Unauthorized if no token is found
    if (!token) {
      return next(new AppError("You are not logged in", UNAUTHORIZED));
    }

    // 2) Verify token
    // Uses jwt.verify() to decode and validate the token using the secret
    const decoded = jwt.verify(token, jwtConfig.secret) as {
      type: string;
      user: {
        id: string;
        email: string;
        role: string;
      };
    };

    // Ensures only access tokens (not refresh tokens) can be used for protected routes
    if (decoded.type !== "access") {
      return next(new AppError("Invalid token type", UNAUTHORIZED));
    }

    // 3) Check if user still exists
    const user = await UsersCollection.findById(decoded.user.id);
    if (!user) {
      return next(new AppError("User no longer exists", UNAUTHORIZED));
    }

    // 4) Grant access to authorized route
    // Adds the user to req so that downstream handlers can access it
    req.user = user;
    next();

  } catch (error) {
    // Differentiates between an expired token and other token errors
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError("Token has expired", UNAUTHORIZED));
    } else {
      next(new AppError("Invalid token", UNAUTHORIZED));
    }
  }
};

// higher-order middleware that returns a middleware function
// Usage: restrictTo("admin", "teacher")
export const restrictTo = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Compares the user's role against the allowed roles. If unauthorized, throws 403 Forbidden
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          FORBIDDEN
        )
      );
    }
    next();
  };
};
