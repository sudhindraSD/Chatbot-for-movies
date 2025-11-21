import axios from "axios";
import toast from "react-hot-toast";

/**
 * Axios instance configured for FlickPick backend
 * - Base URL points to Express backend
 * - Credentials enabled for JWT cookies
 * - Request/response interceptors for logging and error handling
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true, // CRITICAL: Send JWT cookies with every request
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

console.log(
  "API Base URL:",
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"
);

// Request interceptor - Log all outgoing requests (debugging)
api.interceptors.request.use(
  (config) => {
    console.log(
      `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
      config.data
    );
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors globally
api.interceptors.response.use(
  (response) => {
    // Success response - just return the data
    console.log(`[API Response] ${response.config.url}`, response.data);
    return response.data; // Return only the data, not the full axios response
  },
  (error) => {
    console.error("[API Response Error] Full error:", error);
    console.error("[API Response Error] Error code:", error.code);
    console.error("[API Response Error] Error message:", error.message);
    console.error("[API Response Error] Error response:", error.response);
    console.error("[API Response Error] Error request:", error.request);

    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          toast.error("Session expired. Please login again.");
          // Only redirect if not already on login/signup pages
          if (
            !window.location.pathname.includes("/login") &&
            !window.location.pathname.includes("/signup")
          ) {
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
          }
          break;

        case 403:
          toast.error("Access denied");
          break;

        case 404:
          toast.error("Resource not found");
          break;

        case 500:
          toast.error("Server error. Please try again later.");
          break;

        default:
          toast.error(data?.message || "Something went wrong");
      }

      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Request made but no response received - Network error
      console.error("[NETWORK ERROR] Backend might be down or CORS issue");
      console.error(
        "[NETWORK ERROR] Trying to reach:",
        error.config?.baseURL + error.config?.url
      );
      toast.error("Cannot connect to server. Is the backend running?");
      return Promise.reject({
        message: "Network error - Cannot reach backend",
      });
    } else {
      // Something else happened
      console.error("[UNKNOWN ERROR] Error setting up request:", error.message);
      toast.error("An unexpected error occurred");
      return Promise.reject(error);
    }
  }
);

export default api;
