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
      setFetchError("Failed to load child profiles. Please try later.");
      console.error("Profile fetch error:", error);
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
    <div className="relative p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-start items-center mb-8 space-x-4">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <button
          onClick={() => { setEditingProfile(null); setShowForm(true); }}
          className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow transition"
          disabled={showForm}
        >
          {profiles.length === 0 ? "Create First Child Profile" : "+ Add Child Profile"}
        </button>
      </div>

      {fetchError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
          {fetchError}
        </div>
      )}

      {profiles.length === 0 ? (
        <p className="text-gray-600">You haven't created any child profiles yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map(profile => (
            <div key={profile.child_id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <p className="text-sm text-gray-700">Age: {profile.age}</p>
              <p className="text-sm text-gray-700">Gender: {profile.gender}</p>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => navigate(`/chat/${profile.child_id}`)}
                  className="block text-blue-500 hover:underline text-sm"
                >
                  Chat with {profile.name}
                </button>
                <div className="flex gap-3 text-sm">
                  <button onClick={() => { setEditingProfile(profile); setShowForm(true); }} className="text-gray-700 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(profile.child_id)} className="text-red-500 hover:underline">
                    {deletingId === profile.child_id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred backdrop */}
          <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity ease-in duration-200" />

          {/* Animated modal */}
          <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-md w-full z-10 transform transition-all duration-300 ease-out scale-75 opacity-0 animate-fade-in-up">
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
