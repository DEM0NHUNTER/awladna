import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token missing.");
      return;
    }

    const verifyEmail = async () => {
      try {
        await axiosInstance.post("/auth/verify-email", { token });
        setStatus("success");
        setMessage("Email successfully verified.");
      } catch {
        setStatus("error");
        setMessage("Failed to verify email.");
      }
    };

    verifyEmail();
  }, [token]);

  if (status === "pending") return <p>Verifying your email...</p>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded text-center">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      <p className={status === "success" ? "text-green-600" : "text-red-600"}>
        {message}
      </p>
    </div>
  );
};

export default VerifyEmail;
