// src/components/layout/Sidebar.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DarkModeToggle from '../ui/DarkModeToggle'; // Import toggle
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';


interface ChildProfile {
  child_id: number;
  name: string;
  age: number;
  gender: string;
}

interface SidebarProps {
  childId: number;
}

const Sidebar: React.FC = () => {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const navigate = useNavigate();
  const { childId } = useParams<{ childId: string }>();
  const selectedId = Number(childId);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await axiosInstance.get("/auth/child");
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
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Children</h3>
        {children.length === 0 && (
          <p className="text-gray-500 text-sm">No profiles found</p>
        )}
        <ul className="space-y-2">
          {children.map(child => (
            <li
              key={child.child_id}
              onClick={() => handleSelect(child.child_id)}
              className={`cursor-pointer px-3 py-2 rounded-lg ${
                child.child_id === selectedId
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              {child.name} ({child.age}y)
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => navigate("/profile")}
        className="mt-6 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm"
      >
        ➕ Add Child
      </button>
    </aside>
    );
  };

export default Sidebar;
