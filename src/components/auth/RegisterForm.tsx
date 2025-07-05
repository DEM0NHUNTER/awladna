/* eslint no-undef: "error" */

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const RegisterForm: React.FC = () => {
  const { register, user } = useAuth(); // ✅ destructure register directly
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("errors.passwordsDoNotMatch", "Passwords do not match"));
      return;
    }

    if (password.length < 6) {
      setError(t("errors.passwordTooShort", "Password must be at least 6 characters"));
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      toast.success(t("accountCreated", "Account created successfully!"));
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(t("errors.registrationFailed", "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f6fd] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t("createAccount", "Create Account")}
          </h1>
          <p className="text-gray-600">
            {t("joinUs", "Join us and start your parenting journey")}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t("emailAddress", "Email Address")}
              </label>
              <input
                id="email"
                type="email"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("enterEmail", "Enter your email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t("password", "Password")}
              </label>
              <input
                id="password"
                type="password"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("enterPassword", "Create a password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {t("passwordMinLength", "Must be at least 6 characters")}
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t("confirmPassword", "Confirm Password")}
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("enterConfirmPassword", "Confirm your password")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? t("creatingAccount", "Creating account…")
                : t("createAccount", "Create Account")}
            </button>
          </form>

          {/* Login redirect */}
          <div className="mt-6 text-center text-sm text-gray-600">
            {t("alreadyHaveAccount", "Already have an account?")}&nbsp;
            <Link to="/login" className="text-blue-600 hover:underline">
              {t("signInToExisting", "Sign in")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
