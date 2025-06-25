import jwt from "jsonwebtoken";
import { UsersCollection, UserDocument } from "../models/user.model";
import { jwtConfig } from "../config/jwt"; // JWT-related config like secret keys and expiration options
import { AppError } from "../utils/error"; // Custom error handler class for structured error responses
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "../utils/http-status"; // HTTP status constants (400, 404, 401)

// UsersCollection: Mongoose model for user documents
// UserDocument: TypeScript interface/type for a user instance

// Accepts an object containing user input for sign-up
const signUp = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<{
  user: UserDocument;
  accessToken: string;
  refreshToken: string;
}> => {

  // trim input
  // Normalizes the input: trims whitespace and lowercases the email
  userData.email = userData.email.toLowerCase().trim();
  userData.name = userData.name.trim();

  // check password length
  if (userData.password.length < 8) {
    throw new AppError("Password must be at least 8 characters", BAD_REQUEST);
  }
  if (!userData.email || !userData.password || !userData.role) {
    throw new AppError("Missing required fields", 400);
  }

  // Validates user role to be either teacher or student
  if (!["teacher", "student"].includes(userData.role as any)) {
    throw new AppError(
      "Invalid role. Only 'teacher' and 'student' roles are allowed for registration",
      BAD_REQUEST
    );
  }

  // Checks if the email already exists in the database
  const existingUser = await UsersCollection.findOne({ email: userData.email });

  if (existingUser) {
    throw new AppError("Email already exists", BAD_REQUEST);
  }

  // Creates and saves the new user
  const user = await UsersCollection.create(userData);
  // Generates JWT access and refresh tokens for the new user
  const { accessToken, refreshToken } = await generateTokens(user);

  return { user, accessToken, refreshToken };
};

const signIn = async (
  email: string,
  password: string
): Promise<{
  user: UserDocument;
  accessToken: string;
  refreshToken: string;
}> => {

  // Finds the user by email
  const user = await UsersCollection.findOne({ email });

  console.log("Attempting login for:", email);

  if (!user) {
    console.log("User not found");
    throw new AppError("Invalid credentials", UNAUTHORIZED);
  }

  // Uses a method defined in the user model to compare passwords using bcrypt
  // return true or false
  const passwordMatches = await user.comparePassword(password);

  console.log("Password match:", passwordMatches);

  if (!passwordMatches) {
    throw new AppError("Invalid credentials", UNAUTHORIZED);
  }

  // If login is valid, generate and return new tokens
  const { accessToken, refreshToken } = await generateTokens(user);

  return { user, accessToken, refreshToken };
};

// Accepts a refresh token
const refreshToken = async (
  token: string
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  try {

    // Decodes the JWT token and extracts user info
    const decoded = jwt.verify(token, jwtConfig.secret) as {
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
      type: string;
    };

    // Ensures the token is specifically a refresh token, not access
    if (decoded.type !== "refresh") {
      throw new AppError("Invalid token type", UNAUTHORIZED);
    }

    const user = await UsersCollection.findById(decoded.user.id);

    // If the user doesn't exist, reject the request
    if (!user) {
      throw new AppError("User not found or inactive", UNAUTHORIZED);
    }

    // Issue a new pair of tokens
    return generateTokens(user);
    
  } catch (error) {
    throw new AppError("Invalid refresh token", UNAUTHORIZED);
  }
};

// Accepts a user ID
const deleteAccount = async (userId: string): Promise<void> => {

  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw new AppError("User not found", NOT_FOUND);
  }

  // Deletes the user from the database
  await UsersCollection.findByIdAndDelete(userId);

};

// Accepts a user document instance
const generateTokens = async (
  user: UserDocument
): Promise<{ accessToken: string; refreshToken: string }> => {

  // Creates a short-lived access token (expires in 15 minutes)
  const accessToken = jwt.sign(
    {
      type: "access",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    },
    jwtConfig.secret,
    jwtConfig.accessToken.options
  );

  // Creates a long-lived refresh token (expires in 7 days)
  const refreshToken = jwt.sign(
    {
      type: "refresh",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    },
    jwtConfig.secret,
    jwtConfig.refreshToken.options
  );

  return { accessToken, refreshToken };
};

// Makes all the service functions available to the controller
export { signUp, signIn, refreshToken, deleteAccount, generateTokens };
