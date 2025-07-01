import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import LogoutButton from "../auth/LogoutButton";

const Header: React.FC = () => {
  const { user, loading, mockLogout } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <Link to="/" className="text-2xl font-semibold text-indigo-600">
          Awladna
        </Link>
        <nav className="flex items-center gap-4">
          {loading ? (
            <span className="text-gray-500">Loading...</span>
          ) : user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                Profile
              </Link>
              <LogoutButton />
              {/* Mock Logout Button for Development */}
              <button
                onClick={mockLogout}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
                title="Mock Logout (Development)"
              >
                🚀 Mock Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;