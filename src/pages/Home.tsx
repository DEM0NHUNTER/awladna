import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <div className="max-w-3xl mx-auto p-6 mt-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200">
      <h1 className="text-4xl font-bold mb-6 text-indigo-700 text-center">Welcome to Awladna</h1>

      <p className="text-lg text-gray-700 mb-8 text-center">
        A platform designed to connect, share, and grow together. Whether you're new or returning, we're glad to have you here.
      </p>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : user ? (
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-4">
            Hello, <strong>{user.email}</strong>! Go to your{" "}
            <Link to="/profile" className="text-indigo-600 hover:text-indigo-800 font-medium underline transition">
              Profile
            </Link>.
          </p>
          <Link
            to="/dashboard"
            className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition-transform transform hover:scale-105 duration-200 text-center"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-white text-indigo-600 border border-indigo-600 font-semibold shadow hover:bg-indigo-50 transition-transform transform hover:scale-105 duration-200 text-center"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;