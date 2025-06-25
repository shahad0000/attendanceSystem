import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs"; // Library for securely hashing and comparing passwords.

// Schema: Defines the structure of MongoDB documents
// model: Creates a Mongoose model from a schema
// Document: Base interface extended by all Mongoose documents

// Extends Mongoose’s Document type with user fields
export interface UserDocument extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "principal" | "teacher" | "student";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>; // comparePassword method allows comparison between plain and hashed passwords
}

// Defines the fields, types, and validation for user documents
const userSchema = new Schema<UserDocument>(
  {
    // Required, max 100 chars, trims whitespace
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // Required and unique, Automatically trimmed and lowercased
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Required, must be at least 8 characters long 
    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    // Must be one of the allowed values. Validation is built-in via enum
    role: {
      type: String,
      enum: ["admin", "principal", "teacher", "student"],
      required: true,
    },
  },
  {
    // Adds createdAt and updatedAt automatically.
    timestamps: true,

    // Disables virtual id getter (you override it manually)
    id: false,

    // Customizes JSON and object outputs (hiding password, removing _id, adding id)
    // Ensures returned objects are clean for APIs (no _id, no __v)
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        return {
          id: ret.id,
          name: ret.name,
          email: ret.email,
          role: ret.role,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
        };
      },
    },

    // Controls the structure of the returned user (removes sensitive fields like password)
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        return {
          id: ret.id,
          name: ret.name,
          email: ret.email,
          role: ret.role,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
        };
      },
    },
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {

  // Only rehash the password if it has been changed or created
  if (!this.isModified("password")) return next();

  try {
    // Uses bcrypt to hash the password before saving
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error: any) {
    return next(error);
  }
});

// Compare password method
// Compares the plain password with the hashed one in the database
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Creates a model named "User" and exports it as UsersCollection
export const UsersCollection = model<UserDocument>("User", userSchema);
