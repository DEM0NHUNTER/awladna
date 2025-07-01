import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DarkModeToggle from '../ui/DarkModeToggle';

interface SidebarProps {
  childId: string;
}

const Sidebar: React.FC<SidebarProps> = ({ childId }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Logo/Brand Section */}
      <div className="p-6 border-b border-[#000080]/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">Awladna</h1>
            <p className="text-white text-sm">AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
        <div className="space-y-2">
          <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
            Navigation
          </h3>
          
          <Link
            to={`/child-profiles/${childId}`}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              isActive(`/child-profiles/${childId}`)
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white hover:bg-white/10 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium">Profile</span>
          </Link>

          <Link
            to="/chat"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              isActive('/chat')
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white hover:bg-white/10 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-medium">Chat</span>
          </Link>

          <Link
            to="/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              isActive('/dashboard')
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white hover:bg-white/10 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
            Quick Actions
          </h3>
          
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 hover:text-white transition-all duration-200 group">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="font-medium">New Chat</span>
            </button>

            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white hover:bg-white/10 hover:text-white transition-all duration-200 group">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-medium">Chat History</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-6 border-t border-[#000080]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Demo User</p>
              <p className="text-white text-xs">Online</p>
            </div>
          </div>
          <DarkModeToggle />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;