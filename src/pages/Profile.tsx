// src/pages/Profile.tsx

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { ChildProfileResponse } from "@/types"; // Create this type based on backend schema

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Child Profiles</h1>

      {status && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
          {status}
        </div>
      )}

      {/* Profile List */}
      {profiles.length > 0 && !isCreating && !editingId && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Existing Profiles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map(profile => (
              <div key={profile.child_id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{profile.name}</h3>
                    <p>Age: {profile.age}</p>
                    <p>Gender: {profile.gender}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(profile)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(profile.child_id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleCreateNew}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create New Profile
          </button>
        </div>
      )}

      {/* Form for Create/Edit */}
      {(isCreating || editingId) && (
        <div className="mb-8 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Profile' : 'Create New Profile'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1">Name:</label>
              <input
                name="name"
                value={currentProfile.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Gender:</label>
              <input
                name="gender"
                value={currentProfile.gender}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Birth Date:</label>
              <input
                name="birth_date"
                type="date"
                value={currentProfile.birth_date}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editingId ? 'Update' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                type="button"
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {profiles.length === 0 && !isCreating && (
        <div className="text-center py-8">
          <p className="mb-4">No child profiles found</p>
          <button
            onClick={handleCreateNew}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create Your First Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;