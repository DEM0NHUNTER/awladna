import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");
    setMessage("");
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      setStatus("success");
      setMessage("If this email is registered, you will receive reset instructions.");
    } catch {
      setStatus("error");
      setMessage("Failed to send reset email.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      {message && (
        <p className={status === "success" ? "text-green-600" : "text-red-600"}>
          {message}
        </p>
      )}
      <label className="block mb-4">
        Email
        <input
          type="email"
          className="w-full p-2 border border-gray-300 rounded mt-1"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </label>
      <button
        type="submit"
        className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
      >
        Send Reset Email
      </button>
    </form>
  );
};

export default ForgotPassword;
