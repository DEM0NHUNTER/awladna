import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../auth/LogoutButton";

const Header: React.FC = () => {
  const { user, loading } = useAuth();

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
                to="/chat"
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                Chat
              </Link>
              <LogoutButton />
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default Header;
