import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <div className="max-w-3xl mx-auto p-6 mt-12 bg-white rounded shadow">
      <h1 className="text-4xl font-bold mb-6 text-indigo-700">Welcome to Awladna</h1>
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : user ? (
        <p className="text-lg text-gray-700">
          Hello, <strong>{user.email}</strong>! Go to your{" "}
          <Link to="/profile" className="text-blue-600 hover:underline">
            Profile
          </Link>
          .
        </p>
      ) : (
        <p className="text-lg text-gray-700">
          Please{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>{" "}
          or{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>{" "}
          to continue.
        </p>
      )}
    </div>
  );
};

export default Home;
