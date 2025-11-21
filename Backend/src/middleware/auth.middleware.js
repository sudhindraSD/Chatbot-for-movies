import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

/**
 * Authentication Middleware
 * Protects routes by verifying JWT token from cookies
 * Attaches user object to req.user for use in controllers
 */
export const protect = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, please login",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token payload (exclude password)
    const user = await User.findById(decoded.userId).select("-password");

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request object for use in routes
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired, please login again",
      });
    }

    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
