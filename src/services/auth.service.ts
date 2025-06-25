import jwt from "jsonwebtoken";
import { UsersCollection, UserDocument } from "../models/user.model";
import { jwtConfig } from "../config/jwt";
import { AppError } from "../utils/error";
import { BAD_REQUEST, NOT_FOUND, UNAUTHORIZED } from "../utils/http-status";

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
  userData.email = userData.email.toLowerCase().trim();
  userData.name = userData.name.trim();

  // check password length
  if (userData.password.length < 8) {
    throw new AppError("Password must be at least 8 characters", BAD_REQUEST);
  }
  if (!userData.email || !userData.password || !userData.role) {
    throw new AppError("Missing required fields", 400);
  }

  if (!["teacher", "student"].includes(userData.role as any)) {
    throw new AppError(
      "Invalid role. Only 'teacher' and 'student' roles are allowed for registration",
      BAD_REQUEST
    );
  }
  const existingUser = await UsersCollection.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError("Email already exists", BAD_REQUEST);
  }

  const user = await UsersCollection.create(userData);
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
  const user = await UsersCollection.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid credentials", UNAUTHORIZED);
  }

  const passwordMatches = await user.comparePassword(password);
  console.log("Password match:", passwordMatches);
  if (!passwordMatches) {
    throw new AppError("Invalid credentials", UNAUTHORIZED);
  }

  const { accessToken, refreshToken } = await generateTokens(user);
  return { user, accessToken, refreshToken };
};

const refreshToken = async (
  token: string
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as {
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
      type: string;
    };

    if (decoded.type !== "refresh") {
      throw new AppError("Invalid token type", UNAUTHORIZED);
    }

    const user = await UsersCollection.findById(decoded.user.id);
    if (!user) {
      throw new AppError("User not found or inactive", UNAUTHORIZED);
    }

    return generateTokens(user);
  } catch (error) {
    throw new AppError("Invalid refresh token", UNAUTHORIZED);
  }
};

const deleteAccount = async (userId: string): Promise<void> => {
  const user = await UsersCollection.findById(userId);
  if (!user) {
    throw new AppError("User not found", NOT_FOUND);
  }

  await UsersCollection.findByIdAndDelete(userId);
};

const generateTokens = async (
  user: UserDocument
): Promise<{ accessToken: string; refreshToken: string }> => {
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

export { signUp, signIn, refreshToken, deleteAccount, generateTokens };
