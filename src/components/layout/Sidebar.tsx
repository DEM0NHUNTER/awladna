import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import axiosInstance from "@/api/axiosInstance";
// import DarkModeToggle from "../ui/DarkModeToggle"; // Optional

interface ChildProfile {
  child_id: number;
  name: string;
  age: number;
  gender: string;
}

const Sidebar: React.FC = () => {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { childId } = useParams<{ childId: string }>();
  const selectedId = Number(childId);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await axiosInstance.get("/auth/child/");
        setChildren(res.data);
      } catch (err) {
        console.error("Failed to load child profiles", err);
      }
    };
    fetchChildren();
  }, []);

  const handleSelect = (id: number) => {
    if (id !== selectedId) {
      navigate(`/chat/${id}`);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-gradient-to-b from-indigo-900 to-purple-900 text-white p-6 shadow-lg h-screen flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-6">Your Children</h2>

        {children.length === 0 && (
          <p className="text-sm text-white/70">No profiles found</p>
        )}
        <ul className="space-y-2 mb-4">
          {children.map((child) => (
            <li
              key={child.child_id}
              onClick={() => handleSelect(child.child_id)}
              className={`cursor-pointer px-4 py-2 rounded-md transition-all ${
                child.child_id === selectedId
                  ? "bg-white/20 font-semibold"
                  : "hover:bg-white/10 text-white"
              }`}
            >
              {child.name} ({child.age}y)
            </li>
          ))}
        </ul>

        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className={`block px-4 py-2 rounded-md hover:bg-white/10 transition-colors ${
              isActive("/dashboard") ? "bg-white/20" : ""
            }`}
          >
            Dashboard
          </Link>

          {selectedId && (
            <Link
              to={`/chat/${selectedId}`}
              className={`block px-4 py-2 rounded-md hover:bg-white/10 transition-colors ${
                isActive(`/chat/${selectedId}`) ? "bg-white/20" : ""
              }`}
            >
              Chat
            </Link>
          )}

          <Link
            to="/profile"
            className={`block px-4 py-2 rounded-md hover:bg-white/10 transition-colors ${
              isActive("/profile") ? "bg-white/20" : ""
            }`}
          >
            Profile
          </Link>
        </nav>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => navigate("/profile")}
          className="w-full px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white text-sm"
        >
          ➕ Add Child
        </button>

        {/* Optional dark mode toggle */}
        {/* <DarkModeToggle /> */}
      </div>
    </aside>
  );
};

export default Sidebar;
