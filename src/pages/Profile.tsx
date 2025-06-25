// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";

interface Child {
  child_id: number;
  name: string;
  gender: string;
  birth_date: string;
  age: number;
}

const defaultForm = { child_id: null, name: "", gender: "", birth_date: "" };

const Profile: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState<Child[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const res = await axiosInstance.get("/auth/child");
        setProfiles(res.data);
      } catch {
        setStatus("Failed to load child profiles.");
      }
    };
    load();
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startCreate = () => {
    setForm(defaultForm);
    setEditing(true);
    setStatus(null);
  };

  const startEdit = (child: Child) => {
    setForm({
      child_id: child.child_id,
      name: child.name,
      gender: child.gender,
      birth_date: child.birth_date.slice(0,10),
    });
    setEditing(true);
    setStatus(null);
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm(defaultForm);
    setStatus(null);
  };

  const save = async () => {
    try {
      let res;
      if (form.child_id) {
        res = await axiosInstance.put(`/auth/child/${form.child_id}`, form);
        setStatus("Updated successfully.");
      } else {
        res = await axiosInstance.post("/auth/child/", form);
        setStatus("Created successfully.");
        // If this is the first profile, auto-redirect to chat
        if (!profiles.length) navigate(`/chat/${res.data.child_id}`);
      }
      // Refresh list
      const list = await axiosInstance.get("/auth/child");
      setProfiles(list.data);
      setEditing(false);
    } catch {
      setStatus("Error saving profile.");
    }
  };

  const del = async (id: number) => {
    if (!confirm("Delete this profile?")) return;
    try {
      await axiosInstance.delete(`/auth/child/${id}`);
      setProfiles(profiles.filter(p => p.child_id !== id));
      setStatus("Deleted.");
      // If deleted the profile in chat, navigate to profile
      navigate("/profile");
    } catch {
      setStatus("Error deleting profile.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>You must be logged in.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Child Profiles</h1>
      {status && <p className="mb-4 text-blue-600">{status}</p>}

      {/* List existing profiles */}
      {profiles.length > 0 ? profiles.map(c => (
        <div key={c.child_id} className="mb-2 border-b pb-2 flex justify-between">
          <div>
            <strong>{c.name}</strong> • {c.gender} • {c.age}y
          </div>
          <div>
            <button onClick={() => startEdit(c)} className="mr-2 text-blue-600">Edit</button>
            <button onClick={() => del(c.child_id)} className="text-red-600">Delete</button>
          </div>
        </div>
      )) : <p>No child profiles yet.</p>}

      <button onClick={startCreate} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
        {profiles.length ? "Add New Child" : "Create Child Profile"}
      </button>

      {editing && (
        <div className="mt-6 border p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">
            {form.child_id ? "Edit Profile" : "New Profile"}
          </h2>
          <label className="block mb-2">
            Name <input name="name" value={form.name} onChange={handleChange} className="border p-1 ml-2 rounded"/>
          </label>
          <label className="block mb-2">
            Gender <input name="gender" value={form.gender} onChange={handleChange} className="border p-1 ml-2 rounded"/>
          </label>
          <label className="block mb-2">
            Birth Date <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange} className="border p-1 ml-2 rounded"/>
          </label>
          <div className="mt-4 space-x-2">
            <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button onClick={cancelEdit} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
