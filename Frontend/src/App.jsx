import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MoodPage from "./pages/MoodPage";
import ChatPage from "./pages/ChatPage";
import MoviesPage from "./pages/MoviesPage";
import HistoryPage from "./pages/HistoryPage";
import TmdbTestPage from "./pages/TmdbTestPage";
import "./index.css";

/**
 * FlickPick - Main App Component
 * Your Personal Cinema Matchmaker 🎬
 */

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected Routes - Require Authentication */}
            <Route
              path="/mood"
              element={
                <ProtectedRoute>
                  <MoodPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/movies"
              element={
                <ProtectedRoute>
                  <MoviesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/test-tmdb"
              element={
                <ProtectedRoute>
                  <TmdbTestPage />
                </ProtectedRoute>
              }
            />

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/mood" replace />} />

            {/* 404 Catch-All */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-8xl font-bold text-purple-500 mb-4">
                      404
                    </h1>
                    <p className="text-gray-400 text-xl mb-8">
                      Lost in the cinema? This page doesn't exist.
                    </p>
                    <a
                      href="/mood"
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:scale-105 transition-transform inline-block"
                    >
                      Back to Safety 🎬
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>

          {/* Toast Notifications - Styled to match theme */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1f2937",
                color: "#fff",
                border: "2px solid #a855f7",
                borderRadius: "12px",
                padding: "16px",
                fontSize: "14px",
                fontWeight: "500",
              },
              success: {
                iconTheme: {
                  primary: "#a855f7",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
