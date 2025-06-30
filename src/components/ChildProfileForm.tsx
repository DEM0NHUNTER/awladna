// src/components/ChildProfileForm.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import apiClient from '../services/api';

interface FormData {
  name: string;
  birth_date: string;
  gender: string;
  behavioral_patterns: string;
  emotional_state: string;
}

const ChildProfileForm = () => {
  const { child_id } = useParams<{ child_id?: string }>();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    birth_date: '',
    gender: '',
    behavioral_patterns: '',
    emotional_state: '',
  });
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!child_id) return;

    const fetchProfile = async () => {
      try {
        const { data } = await apiClient.get(`/api/child_profile/${child_id}`);
        setFormData({
          ...data,
          birth_date: data.birth_date.split('T')[0],
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [child_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (child_id) {
        await apiClient.put(`/api/child_profile/${child_id}`, formData);
      } else {
        await apiClient.post('/api/child_profile', formData);
      }
      navigate('/profiles');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      {/* Form fields with Tailwind styling */}
    </form>
  );
};

export default ChildProfileForm;