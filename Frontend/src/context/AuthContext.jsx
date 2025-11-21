import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as authService from "../services/authService";

/**
 * AuthContext - Manages authentication state globally
 * Provides user data, loading state, and auth functions to entire app
 */

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  /**
   * Check if user is already logged in on app mount
   * This runs once when the app loads
   */
  const checkAuth = async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (userData && userData.user) {
        setUser(userData.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log("Not authenticated");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login function
   * @param {Object} credentials - { email, password }
   */
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        toast.success("Welcome back! 🎬");
        navigate("/mood");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  /**
   * Signup function
   * @param {Object} userData - { username, email, password }
   */
  const signup = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (response.success && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        toast.success("Account created! Let's pick some movies 🍿");
        navigate("/mood");
      }
    } catch (error) {
      toast.error(error.message || "Signup failed");
      throw error;
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success("See you at the cinema! 👋");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 * Usage: const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export default AuthContext;
