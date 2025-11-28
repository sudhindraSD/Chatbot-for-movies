import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/database.js";
import app from "./app.js";

const startServer = async () => {
  try {
    console.log("[SERVER] Connecting to MongoDB...");
    await connectDB();
    console.log("[SERVER] MongoDB connected successfully");

    console.log("[SERVER] Starting Express server...");
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `[SERVER] ✅ Server is running on port: http://localhost:${PORT}`
      );
      console.log(
        `[SERVER] 🔑 GROQ_API_KEY is ${process.env.GROQ_API_KEY ? "SET ✅" : "MISSING ❌"
        }`
      );
      console.log(
        `[SERVER] 🎬 TMDB_API_KEY is ${process.env.TMDB_API_KEY ? "SET ✅" : "MISSING ❌"
        }`
      );
    });

    server.on("error", (error) => {
      console.error("[SERVER ERROR]", error);
      process.exit(1);
    });

    app.on("error", (error) => {
      console.error("[APP ERROR]", error);
    });
  } catch (error) {
    console.error("[STARTUP ERROR]", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("[UNHANDLED REJECTION]", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("[UNCAUGHT EXCEPTION]", err);
  process.exit(1);
});

startServer();
