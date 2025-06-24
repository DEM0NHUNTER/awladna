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
  const [isEditing, setIsEditing] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await axiosInstance.get("/auth/child");
        if (Array.isArray(res.data) && res.data.length > 0) {
          const first = res.data[0];
          setChild(first);
          setChildId(first.child_id);
          setIsEditing(false);
        } else {
          setChild(defaultChild);
          setChildId(null);
          setIsEditing(true);
        }
      } catch {
        setStatus("Failed to load child profile.");
        setChild(defaultChild);
        setChildId(null);
        setIsEditing(true);
      }
    })();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChild({ ...child, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setStatus(null);
    try {
      const payload = {
        ...child,
        behavioral_patterns: child.behavioral_patterns || {},
        emotional_state: child.emotional_state || {},
      };

      let res;
      if (childId) {
        res = await axiosInstance.put(`/auth/child/${childId}`, payload);
      } else {
        res = await axiosInstance.post("/auth/child", payload);
      }

      setChild(res.data);
      setChildId(res.data.child_id);
      setStatus(childId ? "Child profile updated." : "Child profile created.");
      setIsEditing(false);
      if (!childId) {
        navigate(`/chat/${res.data.child_id}`);
      }
    } catch {
      setStatus("Error saving profile.");
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
