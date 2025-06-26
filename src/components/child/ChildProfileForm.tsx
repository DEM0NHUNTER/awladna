import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

interface Props {
  profile?: any | null;
  onSave: () => void;
  onCancel: () => void;
}

const ChildProfileForm: React.FC<Props> = ({ profile, onSave, onCancel }) => {
  // Basic Profile Fields
  const [name, setName] = useState(profile?.name || "");
  const [birthDate, setBirthDate] = useState(profile?.birth_date?.split("T")[0] || "");
  const [gender, setGender] = useState(profile?.gender || "unspecified");

  // Behavioral Patterns as structured fields
  const [behavioralData, setBehavioralData] = useState({
    tantrums: profile?.behavioral_patterns?.tantrums || "",
    sleep_issues: profile?.behavioral_patterns?.sleep_issues || "",
    social_behavior: profile?.behavioral_patterns?.social_behavior || "",
    // Add more fields as needed
  });

  // Emotional State as structured fields
  const [emotionalData, setEmotionalData] = useState({
    anxiety: profile?.emotional_state?.anxiety || "",
    mood_swings: profile?.emotional_state?.mood_swings || "",
    emotional_triggers: profile?.emotional_state?.emotional_triggers || "",
    // Add more fields as needed
  });

  // Error Handling
  const [error, setError] = useState({ general: "", behavioral: "", emotional: "" });
  const [loading, setLoading] = useState(false);

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError({ general: "", behavioral: "", emotional: "" });

    try {
      // Convert to JSON only when needed
      const behavioralJSON = JSON.stringify(behavioralData);
      const emotionalJSON = JSON.stringify(emotionalData);

      // Validate JSON
      JSON.parse(behavioralJSON); // Ensure valid JSON
      JSON.parse(emotionalJSON);

      // Build Payload
      const payload = {
        name,
        birth_date: birthDate,
        age: calculateAge(birthDate),
        gender,
        behavioral_patterns: behavioralJSON,
        emotional_state: emotionalJSON,
      };

      // API Call
      if (profile?.child_id) {
        await axiosInstance.put(`/auth/child/${profile.child_id}`, payload);
      } else {
        await axiosInstance.post("/auth/child/", payload);
      }

      onSave();
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        if (err.message.includes("behavioral")) {
          setError((prev) => ({
            ...prev,
            behavioral: "Invalid data in Behavioral Patterns",
          }));
        } else if (err.message.includes("emotional")) {
          setError((prev) => ({
            ...prev,
            emotional: "Invalid data in Emotional State",
          }));
        }
      } else {
        setError((prev) => ({
          ...prev,
          general: "Failed to save profile. Please check your inputs and try again.",
        }));
        console.error("Profile save error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper: Calculate Age
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Child's Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                   bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2
                   focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          placeholder="Enter child's name"
          required
        />
      </div>

      {/* Birth Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Birth Date
        </label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                   bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2
                   focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          required
        />
      </div>

      {/* Gender Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Gender
        </label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                   bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2
                   focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          required
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="unspecified">Unspecified</option>
        </select>
      </div>

      {/* Behavioral Patterns Inputs */}
      <div className="pt-4">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Behavioral Patterns</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tantrums
            </label>
            <input
              type="text"
              value={behavioralData.tantrums}
              onChange={(e) =>
                setBehavioralData({ ...behavioralData, tantrums: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2
                       focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Describe tantrum behavior"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sleep Issues
            </label>
            <input
              type="text"
              value={behavioralData.sleep_issues}
              onChange={(e) =>
                setBehavioralData({ ...behavioralData, sleep_issues: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2
                       focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Describe sleep patterns"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Social Behavior
            </label>
            <input
              type="text"
              value={behavioralData.social_behavior}
              onChange={(e) =>
                setBehavioralData({ ...behavioralData, social_behavior: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2
                       focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Describe social interactions"
            />
          </div>
        </div>
        {error.behavioral && (
          <p className="text-red-500 text-sm mt-2">{error.behavioral}</p>
        )}
      </div>

      {/* Emotional State Inputs */}
      <div className="pt-4">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Emotional State</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Anxiety
            </label>
            <input
              type="text"
              value={emotionalData.anxiety}
              onChange={(e) =>
                setEmotionalData({ ...emotionalData, anxiety: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2
                       focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Describe anxiety symptoms"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mood Swings
            </label>
            <input
              type="text"
              value={emotionalData.mood_swings}
              onChange={(e) =>
                setEmotionalData({ ...emotionalData, mood_swings: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2
                       focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Describe mood changes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Emotional Triggers
            </label>
            <input
              type="text"
              value={emotionalData.emotional_triggers}
              onChange={(e) =>
                setEmotionalData({ ...emotionalData, emotional_triggers: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2
                       focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Describe emotional triggers"
            />
          </div>
        </div>
        {error.emotional && (
          <p className="text-red-500 text-sm mt-2">{error.emotional}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
                   rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white
                   rounded-lg shadow hover:shadow-md hover:from-blue-700 hover:to-indigo-700
                   transition-all duration-200 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default ChildProfileForm;