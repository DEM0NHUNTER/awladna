// src/pages/Profile.tsx
import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getChildProfiles,
  createChildProfile,
  updateChildProfile,
  deleteChildProfile,
} from '../services/api';
import ChildProfileForm from '../components/child/ChildProfileForm';

interface Child {
  child_id: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  school?: string;
  challenges?: string;
}

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=000080&color=fff&size=128';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [avatar, setAvatar] = useState<string>(defaultAvatar);

  // Children state from API
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal/form state
  const [showChildForm, setShowChildForm] = useState(false);
  const [childForm, setChildForm] = useState<Partial<Child>>({});
  const [editChildId, setEditChildId] = useState<number | null>(null);

  // File input for avatar
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1️⃣ Fetch all child profiles on mount
  useEffect(() => {
    (async () => {
      try {
        const data: Child[] = await getChildProfiles();
        setChildren(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load children.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Avatar handlers (unchanged)
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = ev => setAvatar(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const handleAvatarRemove = () => setAvatar(defaultAvatar);

  // Open modals
  const openAddChild = () => {
    setChildForm({});
    setEditChildId(null);
    setShowChildForm(true);
  };
  const openEditChild = (child: Child) => {
    setChildForm(child);
    setEditChildId(child.child_id);
    setShowChildForm(true);
  };

  // Handle form input
  const handleChildFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setChildForm({ ...childForm, [e.target.name]: e.target.value });
  };

  // 2️⃣ Save: create or update via API, then refresh list
  const handleChildFormSave = async () => {
    if (!childForm.name || !childForm.age || !childForm.gender) {
      setError('Name, age, and gender are required.');
      return;
    }

    try {
      if (editChildId != null) {
        await updateChildProfile(editChildId, childForm as any);
      } else {
        await createChildProfile(childForm as any);
      }
      // Refresh list
      const data = await getChildProfiles();
      setChildren(data);
      setShowChildForm(false);
      setChildForm({});
      setEditChildId(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save child profile.');
    }
  };

  // 3️⃣ Delete via API, then update state
  const handleChildDelete = async (child_id: number) => {
    if (!confirm('Delete this child profile?')) return;
    try {
      await deleteChildProfile(child_id);
      setChildren(children.filter(c => c.child_id !== child_id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete profile.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-2 md:px-0">
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-6">{error}</div>
      )}

      {/* User Info */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <img
            src={avatar}
            alt="User Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#000080]"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-2"
          >
            📷
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAvatarChange}
            />
          </button>
          {avatar !== defaultAvatar && (
            <button
              onClick={handleAvatarRemove}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1"
            >
              ✖️
            </button>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
          <div className="text-gray-600 mb-1">{user?.email}</div>
          <button
            onClick={logout}
            className="mt-2 text-sm text-red-600 underline"
          >
            Log out
          </button>
        </div>
      </div>

      {/* My Children Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Children</h2>
          <button
            onClick={openAddChild}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-xl"
          >
            + Add Child
          </button>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : children.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No children added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {children.map(child => (
              <div
                key={child.child_id}
                className="p-5 bg-gray-50 rounded-xl flex justify-between"
              >
                <div>
                  <div className="font-bold">{child.name}</div>
                  <div>Age: {child.age}</div>
                  <div>Gender: {child.gender}</div>
                  {child.school && <div>School: {child.school}</div>}
                  {child.challenges && (
                    <div>Challenges: {child.challenges}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditChild(child)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleChildDelete(child.child_id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Child Modal */}
      {showChildForm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editChildId != null ? 'Edit Child' : 'New Child'}
            </h3>
            <ChildProfileForm
              formData={childForm}
              onChange={handleChildFormChange}
            />
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowChildForm(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleChildFormSave}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
);

export default Profile;
