import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) fetchProfiles();
  }, [user]);

  const fetchProfiles = async () => {
    try {
      const res = await axiosInstance.get("/auth/child/");
      setProfiles(res.data);
      setFetchError(null);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setFetchError("Session expired. Please log in again.");
      } else {
        setFetchError("Failed to load child profiles. Please try again later.");
      }
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

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Your Profile</h1>

        {/* Chat Button in Header */}
        <button
          onClick={() => {
            if (profiles.length > 0) {
              navigate(`/chat/${profiles[0].child_id}`);
            }
          }}
          disabled={profiles.length === 0}
          className={`px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:shadow-md transition-all duration-200 ${
            profiles.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          📩 Chat
        </button>
      </div>

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
            <motion.div
              key={profile.child_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border p-4 rounded shadow bg-white/90 backdrop-blur-sm"
            >
              <h3 className="font-bold text-lg">{profile.name}</h3>
              <p>Age: {profile.age}</p>
              <p>Gender: {profile.gender}</p>

              {/* Chat Button per Profile */}
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => navigate(`/chat/${profile.child_id}`)}
                  className="block w-full text-center text-blue-500 hover:underline py-2 rounded bg-blue-50"
                >
                  Chat with {profile.name}
                </button>

                <div className="flex space-x-2 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(profile)}
                    className="flex-1 text-gray-700 hover:underline"
                    disabled={showForm}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(profile.child_id)}
                    disabled={deletingId === profile.child_id}
                    className={`flex-1 text-red-500 hover:underline ${
                      deletingId === profile.child_id ? "opacity-50" : ""
                    }`}
                  >
                    {deletingId === profile.child_id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <button
        onClick={handleCreate}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        disabled={showForm}
      >
        {profiles.length === 0 ? "Create First Child Profile" : "Add New Child Profile"}
      </button>

      {/* Success Message */}
      {successMessage && (
        <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-3">
          {successMessage}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/90 backdrop-blur-md rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl"
              >
                <ChildProfileForm
                  profile={editingProfile}
                  onSave={handleSave}
                  onCancel={() => setShowForm(false)}
                />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;