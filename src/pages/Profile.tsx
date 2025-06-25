// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import ChildProfileForm from "../components/child/ChildProfileForm";

const Profile: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchProfiles();
  }, [user]);

    const fetchProfiles = async () => {
      try {
        const res = await axiosInstance.get('/auth/child/');
        setProfiles(res.data);
        setFetchError(null);
      } catch (error: any) {
        if (error.response?.status === 401) {
          setFetchError("Session expired. Please log in again.");
          // Optionally redirect to login
        } else {
          setFetchError("Failed to load child profiles. Please try again later.");
        }
        console.error("Profile fetch error:", error);
      }
    };

  const handleCreate = () => {
    setEditingProfile(null);
    setShowForm(true);
  };

  const handleEdit = (profile: any) => {
    setEditingProfile(profile);
    setShowForm(true);
  };

  const handleDelete = async (childId: number) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;
    setDeletingId(childId);
    try {
      await axiosInstance.delete(`/auth/child/${childId}`);
      fetchProfiles();
    } catch (err) {
      alert("Failed to delete profile");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async () => {
    await fetchProfiles();
    setShowForm(false);
    setEditingProfile(null);
  };

  if (authLoading) return <p>Loading...</p>;
  if (!user) return <p>Please log in</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Child Profiles</h2>

        {fetchError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
            {fetchError}
          </div>
        )}

        {profiles.length === 0 ? (
          <p className="mb-4">You haven't created any child profiles yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {profiles.map((profile) => (
              <div key={profile.child_id} className="border p-4 rounded shadow">
                <h3 className="font-bold text-lg">{profile.name}</h3>
                <p>Age: {profile.age}</p>
                <p>Gender: {profile.gender}</p>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => navigate(`/chat/${profile.child_id}`)}
                    className="block text-blue-500 hover:underline"
                  >
                    Chat with {profile.name}
                  </button>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(profile)}
                      className="text-gray-700 hover:underline"
                      disabled={showForm}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(profile.child_id)}
                      className="text-red-500 hover:underline"
                      disabled={deletingId === profile.child_id}
                    >
                      {deletingId === profile.child_id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={showForm}
        >
          {profiles.length === 0 ? "Create First Child Profile" : "Add New Child Profile"}
        </button>

        {profiles.length > 0 && (
          <button
            onClick={() => navigate(`/chat/${profiles[0].child_id}`)}
            className="mt-4 ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Chat
          </button>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-screen overflow-y-auto shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editingProfile ? "Edit Child Profile" : "Create New Child Profile"}
            </h2>
            <ChildProfileForm
              profile={editingProfile}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
