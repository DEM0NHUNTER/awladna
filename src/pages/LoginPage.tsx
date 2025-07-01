// src/pages/LoginPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { login } from '../services/auth.service';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login: storeLogin } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { token, user } = await login(email, password);
      storeLogin(token, user);
      navigate('/chat');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    alert('Google sign-in not implemented yet.');
  };

  const handleFacebookSignIn = () => {
    alert('Facebook sign-in not implemented yet.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f6fd] py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-2">
            <img src="/logo.svg" alt="Logo" className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg text-white ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition duration-200`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center justify-between w-full mt-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="relative w-full my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="space-y-4 w-full">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition"
            >
              <img
                src="/google-icon.svg"
                alt="Google"
                className="h-5 w-5 mr-2"
              />
              Google
            </button>
            <button
              onClick={handleFacebookSignIn}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition"
            >
              <img
                src="/facebook-icon.svg"
                alt="Facebook"
                className="h-5 w-5 mr-2"
              />
              Facebook
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <span className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up here
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;