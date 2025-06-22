// src/pages/VerifyEmail.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [status, setStatus] = useState<"idle" | "success" | "error" | "verified">("idle");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.post("/auth/verify-email", { token });
        setStatus("success");
        setMessage(response.data.status || "Email verified successfully");

        await refreshUser(); // Update auth state

        // Redirect after 2s delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.detail ||
          "Failed to verify email. The token may be expired or invalid."
        );
        console.error("Verification error:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Email Verification
        </h2>

        <div className="text-center py-4">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Verifying your email...</p>
            </div>
          ) : (
            <>
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
                  <p className="text-xl">This email is already verified</p>
                </div>
              )}

              <button
                onClick={() => navigate("/login")}
                className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Back to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;