import React, { useState } from 'react';
import ChildProfileForm from '@/components/child/ChildProfileForm';

const ChildProfilePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const handleSave = (data) => {
    console.log('Profile saved:', data);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6">Child Profiles</h1>

          {showForm ? (
            <div className="mb-8">
              <ChildProfileForm
                onSubmit={handleSave}
                initialData={selectedProfile}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sample child profiles */}
              <div
                className="border-dashed border-2 border-indigo-300 rounded-lg p-6 flex flex-col items-center justify-center"
                onClick={() => setShowForm(true)}
              >
                <span className="text-indigo-600 text-4xl font-bold mb-2">+</span>
                <p className="text-indigo-600">Add New Child</p>
              </div>

              <div className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold">Ali</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    4 years old
                  </span>
                </div>
                <p className="text-gray-600">Behavioral patterns and developmental insights</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>;