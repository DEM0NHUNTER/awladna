import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import ChildProfileForm from "../components/child/ChildProfileForm";
import { PlusIcon } from "@heroicons/react/24/outline";

interface ChildProfile {
  child_id?: number;
  name?: string;
  birth_date?: string;
  age?: number;
  gender?: string;
}

const Profile: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<ChildProfile | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch profiles on load
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
      } else {
        setFetchError("Failed to load child profiles. Please try again later.");
      }
    }
  };

  // Handle create/edit form
  const handleCreate = () => {
    setEditingProfile(null);
    setShowForm(true);
  };

  const handleEdit = (profile: any) => {
    setEditingProfile(profile);
    setShowForm(true);
  };

  const handleSave = async () => {
    await fetchProfiles();
    setShowForm(false);
    setEditingProfile(null);
  };

  // Modal animation variants
  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: -50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Profile Header - Top Left */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Your Profile</h1>
        
        {profiles.length === 0 && (
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            You haven't created any child profiles yet.
          </p>
        )}
        
        {/* Create Button */}
        <button
          onClick={handleCreate}
          className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 
                    text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {profiles.length === 0 ? "Create First Child Profile" : "Add New Child Profile"}
        </button>
      </div>

      {/* Profile List */}
      {authLoading ? (
        <p>Loading...</p>
      ) : !user ? (
        <p>Please log in</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <motion.div
              key={profile.child_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
                        rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
            >
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">{profile.name}</h3>
              <p className="text-gray-600 dark:text-gray-300">Age: {profile.age}</p>
              <p className="text-gray-600 dark:text-gray-300">Gender: {profile.gender}</p>
              
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => navigate(`/chat/${profile.child_id}`)}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Chat with {profile.name}
                </button>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(profile)}
                    className="flex-1 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 
                              transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 py-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Animated Modal Form */}
      <AnimatePresence>
        {showForm && (
          <>
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setShowForm(false)}
            />
            
            {/* Modal Container */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                whileDrag={{ scale: 1.02 }}
                drag
                dragConstraints={{ top: -50, bottom: -50, left: -50, right: -50 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 
                          w-full max-w-lg p-6 relative overflow-hidden"
              >
                {/* Header */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {editingProfile ? "Edit Child Profile" : "Create New Child Profile"}
                  </h2>
                </div>

                {/* Form */}
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