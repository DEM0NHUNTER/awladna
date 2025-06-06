import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Reset token is missing.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axiosInstance.post("/auth/reset-password", { token, password });
      setStatus("success");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch {
      setStatus("error");
      setError("Failed to reset password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {status === "success" && (
        <p className="text-green-600 mb-4">
          Password reset successfully. Redirecting to login...
        </p>
      )}
      <label className="block mb-2">
        New Password
        <input
          type="password"
          className="w-full p-2 border border-gray-300 rounded mt-1"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </label>
      <label className="block mb-4">
        Confirm Password
        <input
          type="password"
          className="w-full p-2 border border-gray-300 rounded mt-1"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </label>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;
