import React from 'react';
import { Link } from 'react-router-dom';

interface ChildProfileProps {
  profile: {
    id: number;
    name: string;
    age: number;
    gender: string;
    birthDate: string;
  };
}

const ChildProfileCard: React.FC<ChildProfileProps> = ({ profile }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold">{profile.name}</h3>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          {profile.age} years old
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-gray-600">Gender: {profile.gender}</p>
        <p className="text-gray-600">Birthday: {profile.birthDate}</p>
      </div>

      <button
        className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition"
      >
        View Details
      </button>
    </div>
  );
};

export default ChildProfileCard;