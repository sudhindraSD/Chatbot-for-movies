import jwt from "jsonwebtoken";

/**
 * Generate JWT token and send it as HTTP-only cookie
 * @param {Object} res - Express response object
 * @param {String} userId - User's MongoDB _id
 * @returns {String} - Generated JWT token
 */
export const generateTokenAndSetCookie = (res, userId) => {
  // Create JWT payload with user ID
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d", // Default 7 days
  });

  // Set cookie with security options
  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side JS from accessing the cookie (XSS protection)
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // CSRF protection - cookie only sent to same site
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  return token;
};

/**
 * Generate JWT token without setting cookie (for API responses)
 * @param {String} userId - User's MongoDB _id
 * @returns {String} - Generated JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};
