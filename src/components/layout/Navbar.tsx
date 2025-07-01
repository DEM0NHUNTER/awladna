import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Chat', path: '/chat' },
  { name: 'Profile', path: '/profile' },
];

const HeartLogo = () => (
  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-400 to-purple-500 mr-2">
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  </span>
);

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center">
          <Link to="/dashboard" className="flex items-center text-xl font-bold text-indigo-700">
            <HeartLogo />
            <span>AWLADNA</span>
          </Link>
        </div>
        {/* Center: Nav Links */}
        <div className="flex-1 flex justify-center">
          <div className="flex space-x-6">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-base font-medium px-3 py-2 rounded-lg transition-colors duration-150 ${
                  location.pathname === link.path
                    ? 'bg-indigo-100 text-indigo-700 font-semibold'
                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        {/* Right: User Info */}
        <div className="flex-1 flex justify-end items-center">
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-3 focus:outline-none group bg-gray-100 rounded-xl px-3 py-2 transition shadow-sm hover:shadow-lg hover:bg-gray-200"
                onClick={() => setDropdownOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <img
                  src={user.picture || '/default-avatar.png'}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold text-gray-900 text-sm group-hover:text-indigo-700 transition">{user.name || user.email}</span>
                  <span className="text-xs text-gray-500 group-hover:text-indigo-700 transition">{user.email}</span>
                </div>
                <svg className="w-5 h-5 ml-2 text-gray-400 group-hover:text-indigo-700 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100 animate-fadeIn">
                  <button
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl transition"
                    onClick={async () => {
                      setDropdownOpen(false);
                      await logout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 