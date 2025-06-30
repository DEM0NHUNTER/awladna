// src/pages/ChildProfilePage.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api';
import { ChildProfile } from '../types/child-profile.types';
import { ChildProfileList } from '../components/ChildProfileList';

const ChildProfilePage = () => {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await apiClient.get('/api/child_profile');
        setChildren(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfiles();
    }
  }, [token]);

  const handleDelete = async (childId: number) => {
    if (!window.confirm('Are you sure you want to delete this profile?')) return;

    try {
      await apiClient.delete(`/api/child_profile/${childId}`);
      setChildren(children.filter(child => child.child_id !== childId));
    } catch (err) {
      setError('Failed to delete profile');
    }
  };

  const handleEdit = (childId: number) => {
    navigate(`/profiles-form/${childId}`);
  };

  if (loading) return <div className="p-4">Loading profiles...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Child Profiles</h1>
        <Link
          to="/profiles-form"
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block hover:bg-blue-600 transition"
        >
          Add New Profile
        </Link>
        <ChildProfileList
          children={children}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ChildProfilePage;