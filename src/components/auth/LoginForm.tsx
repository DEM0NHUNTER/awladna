import React, { useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Placeholder handlers for social login
  const handleGoogleSignIn = () => {
    alert("Google sign-in not implemented yet.");
  };
  const handleFacebookSignIn = () => {
    alert("Facebook sign-in not implemented yet.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f6fd] py-12 px-4 relative">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-2">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart w-8 h-8 text-white"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
            </div>
          </div>
          {/* Title */}
          <h1 className="text-3xl font-bold text-center mb-1">{t('awladna')}</h1>
          <p className="text-gray-500 text-center mb-6">{t('welcomeBack')}</p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center text-red-700 text-sm mb-2">
                {t(error)}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('emailAddress')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={t('enterEmail', 'Enter your email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('password')}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={t('enterPassword', 'Enter your password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6 0a9 9 0 0118 0c0 2.21-1.79 4-4 4H6c-2.21 0-4-1.79-4-4a9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7c1.02 0 2.01.15 2.96.43M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.36 6.36L4.22 4.22" />
                    </svg>
                  )}
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-colors shadow-md mt-2 disabled:opacity-50"
            >
              {loading ? t('signingIn', 'Signing in...') : t('signIn', 'Sign In')}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 w-full">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-4 text-gray-400 font-medium">{t('orContinueWith', 'Or continue with')}</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          {/* Social Login Buttons */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center py-3 mb-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.44 1.22 8.47 3.22l6.32-6.32C34.64 2.36 29.74 0 24 0 14.82 0 6.88 5.82 2.69 14.09l7.74 6.01C12.13 13.09 17.56 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.66 7.01l7.19 5.6C43.98 37.36 46.1 31.45 46.1 24.55z"/><path fill="#FBBC05" d="M9.43 28.09c-1.09-3.22-1.09-6.68 0-9.9l-7.74-6.01C-1.13 17.09-1.13 30.91 1.69 37.91l7.74-6.01z"/><path fill="#EA4335" d="M24 46c6.48 0 11.92-2.15 15.89-5.86l-7.19-5.6c-2.01 1.35-4.59 2.16-8.7 2.16-6.44 0-11.87-3.59-13.57-8.6l-7.74 6.01C6.88 42.18 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            {t('continueWithGoogle', 'Continue with Google')}
          </button>
          <button
            onClick={handleFacebookSignIn}
            className="w-full flex items-center justify-center py-3 rounded-lg border border-gray-300 bg-[#1877f2] text-white font-medium hover:bg-[#145db2] transition-colors shadow-sm"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
            {t('continueWithFacebook', 'Continue with Facebook')}
          </button>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <span className="text-gray-600">{t('dontHaveAccount')} </span>
            <Link to="/register" className="text-blue-600 font-medium hover:underline">{t('signUpHere')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// LanguageSwitcher component
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' }
  ];
  const current = languages.find(l => l.code === i18n.language) || languages[0];
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow hover:bg-gray-50 transition text-gray-700 font-semibold focus:outline-none"
        onClick={() => setOpen(o => !o)}
        aria-label="Change language"
      >
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
        <span>{current.label}</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`block w-full text-left px-4 py-2 hover:bg-blue-50 transition ${i18n.language === lang.code ? 'bg-blue-100 font-bold' : ''}`}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoginForm;
