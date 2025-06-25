// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const defaultChild = {
  name: "",
  gender: "",
  birth_date: "",
  behavioral_patterns: {},
  emotional_state: {},
};

const Profile: React.FC = () => {
  const { user, loading } = useAuth();
  const [child, setChild] = useState<any>(defaultChild);
  const [childId, setChildId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(true);  // always editable initially
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  // Always fetch existing profile (if any)
  useEffect(() => {
    if (!user) return;
    axiosInstance.get("/auth/child")
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0 && res.data[0]?.child_id) {
          setChild(res.data[0]);
          setChildId(res.data[0].child_id);
          setIsEditing(true);
        } else {
          setChild(defaultChild);
          setChildId(null);
          setIsEditing(true);
        }
      })
      .catch(() => {
        setStatus("Failed to load child profile.");
        setIsEditing(true);
      });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChild({ ...child, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setStatus(null);
    const payload = {
      name: child.name,
      gender: child.gender,
      birth_date: child.birth_date,
      behavioral_patterns: child.behavioral_patterns || {},
      emotional_state: child.emotional_state || {},
    };

    try {
      if (childId) {
        await axiosInstance.put(`/auth/child/${childId}`, payload);
        setStatus("Child profile updated.");
      } else {
        const res = await axiosInstance.post("/auth/child/", payload);
        setChild(res.data);
        setChildId(res.data.child_id);
        setStatus("Child profile created.");
        navigate(`/chat/${res.data.child_id}`);
      }
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setStatus("Error saving profile.");
      setIsEditing(true);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You must be logged in to view this page.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Child Profile</h1>

      {status && <p className="mb-4 text-blue-600">{status}</p>}

      <label className="block mb-3">
        Name:
        <input
          name="name"
          value={child.name}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full border p-2 rounded mt-1"
        />
      </label>

      <label className="block mb-3">
        Gender:
        <input
          name="gender"
          value={child.gender}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full border p-2 rounded mt-1"
        />
      </label>

      <label className="block mb-3">
        Birth Date:
        <input
          name="birth_date"
          type="date"
          value={child.birth_date?.slice(0, 10) || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full border p-2 rounded mt-1"
        />
      </label>

      <div className="mt-4 space-x-4">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
