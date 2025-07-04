import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import logger from "./utils/logger";
import { dev, port } from "./utils/helpers";
import { OK, INTERNAL_SERVER_ERROR } from "./utils/http-status";
import { connectDB, deleteAllCollections } from "./config/db";
import { AppError } from "./utils/error";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import classRoutes from "./routes/class.routes";
import participantRoutes from "./routes/participant.routes";
import principalRoutes from "./routes/principal.routes";
import teacherRoutes from "./routes/teacher.routes";
import studentRouter from "./routes/student.routes";

// // Delete all collections
// deleteAllCollections();

// Connect to MongoDB
connectDB();

const app: Express = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://flourishing-mochi-19a4c2.netlify.app",
];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(
  morgan("tiny", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/class", classRoutes);
app.use("/participants", participantRoutes);
app.use("/principal", principalRoutes);
app.use("/teacher", teacherRoutes);
app.use("/student", studentRouter);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.status(OK).json({ message: "This is Attendance System API - Welcome!" });
});

// Error handling middleware
app.use(
  (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    logger.error("Error:", err.message);

    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        ...(dev && { stack: err.stack }),
      });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Something went wrong!",
      ...(dev && { error: err.message, stack: err.stack }),
    });
  }
);

const serverPort = Number(process.env.PORT) || 3000;

// Start server
app.listen(serverPort, () => {
  logger.info(`Server is running on port ${serverPort}`);
});
