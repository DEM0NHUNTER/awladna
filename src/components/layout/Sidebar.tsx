import React from 'react';
import { Link } from 'react-router-dom';
import DarkModeToggle from '../ui/DarkModeToggle'; // Import toggle

interface SidebarProps {
  childId: number;
}

const Sidebar: React.FC<SidebarProps> = ({ childId }) => {
  return (
    <div className="w-64 bg-white shadow-md h-full">
      <nav className="mt-8">
        <ul className="space-y-4 p-4">
          <li>
            <Link
              to={`/child-profiles/${childId}`}
              className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded"
            >
              Child Profile
            </Link>
          </li>
          <li>
            <Link
              to="/chat"
              className="block px-4 py-2 text-blue-600 hover:bg-blue-50 rounded"
            >
              Chat Page
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;