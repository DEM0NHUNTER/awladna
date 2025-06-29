import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LogoutButton from "../auth/LogoutButton";

const Header: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Hide most nav buttons on /chat page
  const hideButtons = location.pathname.startsWith("/chat");

  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 shadow-lg px-6 py-4 border-b border-white/20">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          Awladna
        </Link>

        <nav className="flex items-center gap-4">
          {!loading && !hideButtons && (
            <>
              {user && (
                <Link
                  to="/profile"
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  Profile
                </Link>
              )}
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1 bg-white/20 text-white rounded hover:bg-white/30 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}

          {!loading && user && <LogoutButton />}
        </nav>
      </div>
    </header>
  );
};

export default Header;