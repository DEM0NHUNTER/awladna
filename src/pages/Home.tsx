import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to Awladna</h1>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <p>
          Hello, <strong>{user.email}</strong>! Go to your{" "}
          <Link to="/profile" className="text-blue-600 underline">
            Profile
          </Link>
          .
        </p>
      ) : (
        <>
          <p>Please <Link to="/login" className="text-blue-600 underline">Login</Link> or <Link to="/register" className="text-blue-600 underline">Register</Link> to continue.</p>
        </>
      )}
    </div>
  );
};

export default Home;
