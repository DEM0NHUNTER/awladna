// src/components/NavBar.tsx
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const NavBar = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-blue-600 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-semibold">
          Parenting Assistant
        </Link>
        <div className="flex space-x-4">
          {user ? (
            <>
              <Link to="/chat" className="text-white hover:bg-blue-700 px-3 py-2 rounded">
                Chat
              </Link>
              <Link to="/profiles" className="text-white hover:bg-blue-700 px-3 py-2 rounded">
                Profiles
              </Link>
              <button onClick={logout} className="text-white hover:bg-red-600 px-3 py-2 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:bg-blue-700 px-3 py-2 rounded">
                Login
              </Link>
              <Link to="/register" className="text-white hover:bg-blue-700 px-3 py-2 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar; // Ensure default export [[1]]