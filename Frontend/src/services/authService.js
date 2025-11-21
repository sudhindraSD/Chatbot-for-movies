import api from "./api";

/**
 * Authentication Service
 * Handles user registration, login, logout, and session management
 */

/**
 * Register a new user account
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @returns {Promise<Object>} User data
 */
export const register = async (userData) => {
  try {
    const response = await api.post("/users/register", userData);
    return response;
  } catch (error) {
    throw new Error(error.message || "Registration failed");
  }
};

/**
 * Login existing user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - Email address
 * @param {string} credentials.password - Password
 * @returns {Promise<Object>} User data
 */
export const login = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials);
    return response;
  } catch (error) {
    throw new Error(error.message || "Login failed");
  }
};

/**
 * Logout current user
 * Clears JWT cookie on backend
 * @returns {Promise<Object>} Success message
 */
export const logout = async () => {
  try {
    const response = await api.post("/users/logout");
    return response;
  } catch (error) {
    throw new Error(error.message || "Logout failed");
  }
};

/**
 * Get current logged-in user data
 * Used to check if user is authenticated on app load
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/users/me");
    return response;
  } catch (error) {
    // Don't throw on 401 - just return null (user not authenticated)
    if (error.status === 401) {
      return null;
    }
    throw new Error(error.message || "Failed to get user data");
  }
};
