import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app = express(); //create an express app

// CORS - MUST be before helmet for proper configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies to be sent with requests
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Security Middleware - Configure helmet to work with CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Logging Middleware - Logs all HTTP requests in dev mode
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev")); // Logs: GET /api/v1/users 200 15ms
}

// Body Parser Middleware
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies (with size limit)
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parse URL-encoded bodies

// Cookie Parser - Parse cookies from requests
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.route.js";
import moodRoutes from "./routes/moodRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import preferencesRoutes from "./routes/preferencesRoutes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/mood", moodRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/movies", movieRoutes);
app.use("/api/v1/preferences", preferencesRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler - Must be LAST
import { errorHandler } from "./middleware/error.middleware.js";
app.use(errorHandler);

export default app;
