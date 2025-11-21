import axios from "axios";

// Configured Axios instance for talking to the FlickPick backend API.
// - baseURL MUST match the backend (port 5000 as specified in requirements)
// - withCredentials enables httpOnly JWT cookies to be sent/received
const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Global response interceptor for basic error normalization.
// It guarantees that rejected promises always contain a `message` field.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject({ message, ...error });
  }
);

export default api;
