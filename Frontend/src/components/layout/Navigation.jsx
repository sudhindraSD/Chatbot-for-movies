import { Link, useLocation } from "react-router-dom";
import { Film, MessageSquare, History, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navigation = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { path: "/mood", label: "Mood", icon: Film },
    { path: "/chat", label: "Chat", icon: MessageSquare },
    { path: "/movies", label: "Movies", icon: Film },
    { path: "/history", label: "History", icon: History },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-black/50 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/mood"
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            FlickPick 🎬
          </Link>

          {/* Nav Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? "bg-purple-500/20 text-purple-300"
                      : "text-gray-400 hover:text-white hover:bg-purple-500/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </div>
                </Link>
              );
            })}

            {/* User Menu */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-purple-500/30">
              <div className="text-sm text-gray-400 hidden sm:block">
                <User className="w-4 h-4 inline mr-1" />
                {user?.username || "User"}
              </div>
              <button
                onClick={logout}
                className="px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
