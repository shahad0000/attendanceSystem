import { Request, Response, NextFunction } from "express";
import * as AuthService from "../services/auth.service";
import { AppError } from "../utils/error";
import { AuthRequest } from "../middleware/auth.middleware"; // custom tyoe that includes the user
import { dev } from "../utils/helpers"; // boolean flag to check if the environment is development or production.
import { CREATED, OK } from "../utils/http-status";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;


    // Calls the signup service to create a user and generate tokens
    const { user, accessToken, refreshToken } = await AuthService.signUp({
      name,
      email,
      password,
      role
    });

    // Sets tokens as HTTP-only cookies

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
      secure: !dev ? true : false,
      sameSite: dev ? "lax" : "none",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: !dev ? true : false,
      sameSite: dev ? "lax" : "none",
    });

    // Responds with user data (without password) and the tokens.
    res.status(CREATED).json({
      status: "success",
      data: {
        // Remove password from output
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    next(error);
  }
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await AuthService.signIn(
      email,
      password
    );

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
      secure: !dev,
      sameSite: dev ? "lax" : "none",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: !dev,
      sameSite: dev ? "lax" : "none",
    });

    res.status(OK).json({
      status: "success",
      data: {
        // Remove password from output
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const signOut = async (req: Request, res: Response) => {
  // Overwrites tokens with 'none', expires in 5 seconds
  res.cookie("accessToken", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.cookie("refreshToken", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(OK).json({
    status: "success",
    message: "Signed out successfully",
  });
};

// Replaces expired access token using a refresh token
const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token not provided", 401);
    }

    // Verifies and refreshes token
    const tokens = await AuthService.refreshToken(refreshToken);

    // Set new cookies
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: !dev,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: !dev,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Returns the new tokens in the response
    res.status(OK).json({
      status: "success",
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

// Authenticated User Account Deletion
const deleteAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {

    // Deletes the user account based on ID
    await AuthService.deleteAccount(req.user.id);

    // Clears authentication cookies

    res.cookie("accessToken", "none", {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    });
    res.cookie("refreshToken", "none", {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    });

    res.status(OK).json({
      status: "success",
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { signUp, signIn, signOut, refreshToken, deleteAccount };
