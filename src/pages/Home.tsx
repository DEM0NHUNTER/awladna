import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-indigo-700">Welcome to Awladna</h1>
        <h2 className="text-2xl font-bold text-green-700 mb-6">✅ Testing Mode Active - All Pages Accessible</h2>
        
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : user ? (
          <div className="space-y-4">
          <p className="text-lg text-gray-700">
              Hello, <strong>{user.email}</strong>! You are logged in as a mock user for testing.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Available Pages for Testing:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Link to="/chat" className="text-blue-600 hover:text-blue-800 hover:underline">💬 Chat</Link>
                <Link to="/profile" className="text-blue-600 hover:text-blue-800 hover:underline">👤 Profile</Link>
                <Link to="/child-profiles/1" className="text-blue-600 hover:text-blue-800 hover:underline">👶 Child Profile</Link>
                <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 hover:underline">📊 Dashboard</Link>
                <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:underline">🔐 Login</Link>
                <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:underline">📝 Register</Link>
                <Link to="/verify-email" className="text-blue-600 hover:text-blue-800 hover:underline">✉️ Verify Email</Link>
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 hover:underline">🔑 Forgot Password</Link>
                <Link to="/reset-password" className="text-blue-600 hover:text-blue-800 hover:underline">🔄 Reset Password</Link>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Testing Notes:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• All pages are accessible without backend</li>
                <li>• Chat uses mock messages and responses</li>
                <li>• Authentication is simulated</li>
                <li>• Use "Mock Logout" button in header to test logout</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
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
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Available Pages for Testing:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Link to="/login" className="text-blue-600 hover:text-blue-800 hover:underline">🔐 Login</Link>
                <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:underline">📝 Register</Link>
                <Link to="/verify-email" className="text-blue-600 hover:text-blue-800 hover:underline">✉️ Verify Email</Link>
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800 hover:underline">🔑 Forgot Password</Link>
                <Link to="/reset-password" className="text-blue-600 hover:text-blue-800 hover:underline">🔄 Reset Password</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;