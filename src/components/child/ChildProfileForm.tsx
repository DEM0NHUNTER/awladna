import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";

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

  const [error, setError] = useState({ general: "", behavioral: "", emotional: "" });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError({ general: "", behavioral: "", emotional: "" });
    setSuccessMessage("");

    try {
      // Validate JSON conversion
      const parsedBehavioral = JSON.parse(JSON.stringify(behavioralData));
      const parsedEmotional = JSON.parse(JSON.stringify(emotionalData));

      const payload = {
        name,
        birth_date: birthDate,
        age: calculateAge(birthDate),
        gender,
        behavioral_patterns: parsedBehavioral,
        emotional_state: parsedEmotional,
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
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        setError((prev) => ({
          ...prev,
          general: "Invalid data in form fields. Please check your inputs.",
        }));
      } else {
        setError((prev) => ({
          ...prev,
          general: "Failed to save profile. Please try again later.",
        }));
      }
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg"
    >
      <h2 className="text-xl font-bold mb-4 text-white">
        {profile?.child_id ? "Edit Child Profile" : "Create New Child Profile"}
      </h2>

      {error.general && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
          {error.general}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-gray-300/30 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Birth Date
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-gray-300/30 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-gray-300/30 text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="unspecified">Unspecified</option>
          </select>
        </div>

        {/* Behavioral Patterns */}
        <div className="pt-4 border-t border-gray-300/20">
          <h3 className="font-semibold text-white mb-3">Behavioral Patterns</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Tantrums
              </label>
              <input
                type="text"
                value={behavioralData.tantrums}
                onChange={(e) =>
                  setBehavioralData({ ...behavioralData, tantrums: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-gray-300/30 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Sleep Issues
              </label>
              <input
                type="text"
                value={behavioralData.sleep_issues}
                onChange={(e) =>
                  setBehavioralData({ ...behavioralData, sleep_issues: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-gray-300/30 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Social Behavior
              </label>
              <input
                type="text"
                value={behavioralData.social_behavior}
                onChange={(e) =>
                  setBehavioralData({ ...behavioralData, social_behavior: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-gray-300/30 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Emotional State */}
        <div className="pt-4 border-t border-gray-300/20">
          <h3 className="font-semibold text-white mb-3">Emotional State</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Anxiety
              </label>
              <input
                type="text"
                value={emotionalData.anxiety}
                onChange={(e) =>
                  setEmotionalData({ ...emotionalData, anxiety: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-gray-300/30 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Mood Swings
              </label>
              <input
                type="text"
                value={emotionalData.mood_swings}
                onChange={(e) =>
                  setEmotionalData({ ...emotionalData, mood_swings: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-gray-300/30 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Emotional Triggers
              </label>
              <input
                type="text"
                value={emotionalData.emotional_triggers}
                onChange={(e) =>
                  setEmotionalData({ ...emotionalData, emotional_triggers: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-gray-300/30 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300/30 text-gray-200 rounded-lg hover:bg-gray-100/10 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Saving..." : profile?.child_id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ChildProfileForm;