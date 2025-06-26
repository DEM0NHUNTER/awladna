import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../auth/LogoutButton";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const Header: React.FC = () => {
  const { user, loading } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <Link to="/" className="text-2xl font-semibold text-indigo-600 dark:text-indigo-300">
          Awladna
        </Link>

        <nav className="flex items-center gap-4">
          {loading ? (
            <span className="text-gray-500 dark:text-gray-300">Loading...</span>
          ) : user ? (
            <>
              <Link
                to="/profile"
                className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Profile
              </Link>
              <LogoutButton />
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {theme === "dark" ? (
                  <SunIcon className="w-6 h-6 text-yellow-400" />
                ) : (
                  <MoonIcon className="w-6 h-6 text-gray-900" />
                )}
              </button>
            </>
          ) : (
            // Nothing shown when user is not logged in
            <></>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
