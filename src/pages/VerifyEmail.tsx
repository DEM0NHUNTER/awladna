import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [status, setStatus] = useState<"idle" | "success" | "error" | "verified">("idle");
  const [message, setMessage] = useState<string>("");
  const { refreshUser } = useAuth();

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing");
        return;
      }

      try {
        // Send token in request body, not query params
        const response = await axiosInstance.post("/auth/verify-email", { token });

        if (response.data.status === "Already verified") {
          setStatus("verified");
        } else {
          setStatus("success");
          setMessage(response.data.status || "Email verified successfully");

          // Refresh auth state to update UI
          await refreshUser();

          // Redirect after delay
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.detail ||
          "Failed to verify email. The token may be expired or invalid."
        );
        console.error("Verification error:", error);
      }
    };

    verify();
  }, [token, navigate, refreshUser]);

  const handleResendVerification = async () => {
    try {
      const response = await axiosInstance.post("/auth/resend-verification", { email: "test@example.com" });
      setMessage(response.data.status || "Verification email resent");
    } catch (error: any) {
      setMessage("Failed to resend verification email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6">Email Verification</h2>

        {status === "idle" && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        )}

        {status === "success" && (
          <div className="text-green-600 mb-4">
            <p className="text-xl">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-red-600 mb-4">
            <p className="text-xl">{message}</p>
          </div>
        )}

        {status === "verified" && (
          <div className="text-blue-600 mb-4">
            <p className="text-xl">This email is already verified.</p>
          </div>
        )}

        <button
          onClick={() => navigate("/login")}
          className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Back to Login
        </button>

        <button
          onClick={handleResendVerification}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Resend verification email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;