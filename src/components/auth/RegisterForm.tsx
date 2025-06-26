import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    await register(formData.email, formData.password, formData.name);
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
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <span className="text-white/70">{step}/2</span>
            </div>
            <div className="mt-2 h-1 w-full bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "50%" }}
                animate={{ width: step === 1 ? "50%" : "100%" }}
                transition={{ duration: 0.4 }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              ></motion.div>
            </div>
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 ? (
              <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-medium text-white/80 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300 peer"
                    placeholder="John Doe"
                  />
                  <span className="absolute left-0 bottom-0 h-0.5 w-full bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-300"></span>
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300 peer"
                    placeholder="you@example.com"
                  />
                  <span className="absolute left-0 bottom-0 h-0.5 w-full bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-300"></span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Next
                </motion.button>
              </form>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300 peer"
                    placeholder="••••••••"
                  />
                  <span className="absolute left-0 bottom-0 h-0.5 w-full bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-300"></span>
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-white/80 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300 peer"
                    placeholder="••••••••"
                  />
                  <span className="absolute left-0 bottom-0 h-0.5 w-full bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-300"></span>
                </div>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-3 px-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Register
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>

          <div className="mt-6 text-center">
            <p className="text-white/70 text-sm">
              Already have an account? <Link to="/login" className="text-white font-medium hover:underline">Log In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;