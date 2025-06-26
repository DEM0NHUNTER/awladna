import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 text-white px-4 py-12">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold mb-6"
        >
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Awladna</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-10"
        >
          Empowering parents and children with safe and supportive communication tools. Build stronger connections today.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link
            to="/login"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold border border-white/20 hover:bg-white/20 transition-all duration-200"
          >
            Create Account
          </Link>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Secure Communication", desc: "End-to-end encrypted conversations between parents and children." },
            { title: "Behavioral Insights", desc: "Track emotional patterns and growth with advanced analytics." },
            { title: "Smart Alerts", desc: "Get real-time notifications for important milestones and behaviors." }
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 * index, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-gray-300">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;