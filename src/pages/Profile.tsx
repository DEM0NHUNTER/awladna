import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

const Profile: React.FC = () => {
  const { user, loading } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        setProfileData(res.data);
      } catch {
        setError("Failed to fetch profile data.");
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) return <p>Loading profile...</p>;

  if (!user) return <p>You must be logged in to see this page.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      {error && <p className="text-red-600">{error}</p>}
      {profileData ? (
        <div>
          <p><strong>Email:</strong> {profileData.email}</p>
          {/* Add more profile info here as needed */}
        </div>
      ) : (
        <p>No profile data available.</p>
      )}
    </div>
  );
};

export default Profile;
