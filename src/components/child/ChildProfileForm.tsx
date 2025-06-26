import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

interface ChildProfile {
  child_id?: number;
  name?: string;
  birth_date?: string;
  gender?: string;
  behavioral_patterns?: Record<string, any>;
  emotional_state?: Record<string, any>;
}

interface Props {
  profile?: ChildProfile | null;
  onSave: () => void;
  onCancel: () => void;
}

const ChildProfileForm: React.FC<Props> = ({ profile, onSave, onCancel }) => {
  const [name, setName] = useState(profile?.name || "");
  const [birthDate, setBirthDate] = useState(
    profile?.birth_date?.split("T")[0] || ""
  );
  const [gender, setGender] = useState(profile?.gender || "unspecified");

  // Behavioral Patterns as structured fields
  const [behavioralData, setBehavioralData] = useState({
    tantrums: profile?.behavioral_patterns?.tantrums || "",
    sleep_issues: profile?.behavioral_patterns?.sleep_issues || "",
    social_behavior: profile?.behavioral_patterns?.social_behavior || "",
  });

  // Emotional State as structured fields
  const [emotionalData, setEmotionalData] = useState({
    anxiety: profile?.emotional_state?.anxiety || "",
    mood_swings: profile?.emotional_state?.mood_swings || "",
    emotional_triggers: profile?.emotional_state?.emotional_triggers || "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = {
        name,
        birth_date: birthDate,
        age: calculateAge(birthDate),
        gender,
        behavioral_patterns: behavioralData,
        emotional_state: emotionalData,
      };

      if (profile?.child_id) {
        await axiosInstance.put(`/auth/child/${profile.child_id}`, payload);
        setSuccessMessage("Profile updated successfully!");
      } else {
        await axiosInstance.post("/auth/child/", payload);
        setSuccessMessage("Profile created successfully!");
      }

      setTimeout(() => {
        onSave();
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-bold mb-4">
        {profile?.child_id ? "Edit Child Profile" : "Create New Child Profile"}
      </h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Birth Date</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="unspecified">Unspecified</option>
          </select>
        </div>

        {/* Behavioral Patterns */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-semibold mb-2">Behavioral Patterns</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Tantrums</label>
              <input
                type="text"
                value={behavioralData.tantrums}
                onChange={(e) =>
                  setBehavioralData({ ...behavioralData, tantrums: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sleep Issues</label>
              <input
                type="text"
                value={behavioralData.sleep_issues}
                onChange={(e) =>
                  setBehavioralData({ ...behavioralData, sleep_issues: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Social Behavior</label>
              <input
                type="text"
                value={behavioralData.social_behavior}
                onChange={(e) =>
                  setBehavioralData({ ...behavioralData, social_behavior: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Emotional State */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="font-semibold mb-2">Emotional State</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Anxiety</label>
              <input
                type="text"
                value={emotionalData.anxiety}
                onChange={(e) =>
                  setEmotionalData({ ...emotionalData, anxiety: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mood Swings</label>
              <input
                type="text"
                value={emotionalData.mood_swings}
                onChange={(e) =>
                  setEmotionalData({ ...emotionalData, mood_swings: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Emotional Triggers</label>
              <input
                type="text"
                value={emotionalData.emotional_triggers}
                onChange={(e) =>
                  setEmotionalData({ ...emotionalData, emotional_triggers: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Saving..." : profile?.child_id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChildProfileForm;