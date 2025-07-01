import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaRobot, FaRegLightbulb, FaUsers } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recentChats, setRecentChats] = useState([]);
  const [childProfiles, setChildProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulated data fetching
  useEffect(() => {
    const fetchData = async () => {
      // Replace with real API calls
      setRecentChats([
        { id: 1, topic: "Temper Tantrums", date: "2025-07-01" },
        { id: 2, topic: "Sleep Training", date: "2025-06-28" }
      ]);

      setChildProfiles([
        { id: 1, name: "Ali", age: 4 },
        { id: 2, name: "Noor", age: 2 }
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.email?.split('@')[0]}! 👋
          </h1>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Edit Profile
          </button>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FaRobot className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">AI Chat</h2>
                <p className="text-gray-600">Get parenting advice anytime</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/chat')}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              Start Chat
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <FaRegLightbulb className="text-green-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Personalized Guidance</h2>
                <p className="text-gray-600">Tailored parenting strategies</p>
              </div>
            </div>
            <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
              View Tips
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <FaUsers className="text-purple-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Child Profiles</h2>
                <p className="text-gray-600">Manage child-specific advice</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/child-profiles')}
              className="mt-4 w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
            >
              Manage Profiles
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>

          <div className="space-y-4">
            {recentChats.map(chat => (
              <div key={chat.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaRobot className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{chat.topic}</p>
                    <p className="text-sm text-gray-500">{chat.date}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/chat/${chat.id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Child Profiles */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Children</h2>
            <button
              onClick={() => navigate('/child-profiles')}
              className="text-indigo-600 hover:text-indigo-800"
            >
              + Add Child
            </button>
          </div>

          {childProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {childProfiles.map(profile => (
                <div key={profile.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-semibold">{profile.name}</h3>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {profile.age} years old
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-600">Behavioral Insights</p>
                    <p className="text-gray-600">Developmental Milestones</p>
                  </div>
                  <button
                    onClick={() => navigate(`/child-profiles/${profile.id}`)}
                    className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't created any child profiles yet</p>
              <button
                onClick={() => navigate('/child-profiles')}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Create Your First Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Dashboard;