import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AnimatedSection from "@/components/AnimatedSection";

const Home: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-500 px-4 py-12">
      <div className="w-full max-w-3xl p-6 bg-white/90 dark:bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center">
        <AnimatedSection animation="fade-up" duration={1000}>
          <h1 className="text-4xl font-bold mb-4 text-indigo-700 dark:text-indigo-300">
            Welcome to Awladna
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 max-w-xl mx-auto">
            A caring space powered by AI to support your parenting journey. Whether you're new or returning, we're glad to have you here.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="zoom-in" duration={800} delay={200}>
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
            <p>Support, guide, and empower your parenting journey.</p>
          </div>
        </AnimatedSection>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : user ? (
          <AnimatedSection animation="fade-right" duration={900} delay={400}>
            <div>
              <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
                Hello, <strong>{user.email}</strong>! Go to your{" "}
                <Link
                  to="/profile"
                  className="text-indigo-600 hover:text-indigo-800 dark:hover:text-indigo-400 font-medium underline transition"
                >
                  Profile
                </Link>.
              </p>
              <Link
                to="/dashboard"
                className="inline-block mt-4 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedSection animation="fade-right" duration={900} delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition-transform transform hover:scale-105"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-6 py-3 bg-white dark:bg-transparent border border-indigo-600 text-indigo-600 dark:text-indigo-300 rounded-md font-semibold transition-transform transform hover:scale-105 hover:bg-indigo-50 dark:hover:bg-white/10"
              >
                Register
              </Link>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
};

export default Home;
