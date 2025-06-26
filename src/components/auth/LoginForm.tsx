import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/20"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="group">
              <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300 peer" 
                placeholder="you@example.com" 
              />
              <span className="absolute left-0 bottom-0 h-0.5 w-full bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-300"></span>
            </div>

            {/* Password Input */}
            <div className="group relative">
              <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300 peer" 
                placeholder="••••••••" 
              />
              <span className="absolute left-0 bottom-0 h-0.5 w-full bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-300"></span>
              <button type="button" className="absolute right-3 top-10 text-white/60 hover:text-white transition">👁️</button>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Log In
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Don't have an account? <Link to="/register" className="text-white font-medium hover:underline">Register</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;