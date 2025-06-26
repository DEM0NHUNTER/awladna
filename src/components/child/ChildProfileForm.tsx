import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

interface ChildProfile {
  child_id?: number;
  name?: string;
  birth_date?: string;
  age?: number;
  gender?: string;
  behavioral_patterns?: object;
  emotional_state?: object;
}

interface Props {
  profile?: ChildProfile | null;
  onSave: () => void;
  onCancel: () => void;
}

const ChildProfileForm: React.FC<Props> = ({ profile, onSave, onCancel }) => {
  const [name, setName] = useState(profile?.name || "");
  const [birthDate, setBirthDate] = useState(profile?.birth_date?.split("T")[0] || "");
  const [gender, setGender] = useState(profile?.gender || "unspecified");
  const [behavioralPatterns, setBehavioralPatterns] = useState(
    JSON.stringify(profile?.behavioral_patterns || {}, null, 2)
  );
  const [emotionalState, setEmotionalState] = useState(
    JSON.stringify(profile?.emotional_state || {}, null, 2)
  );

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState({
    general: "",
    behavioral: "",
    emotional: ""
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError({ general: "", behavioral: "", emotional: "" });
    setSuccessMessage("");

    try {
      let parsedBehavioral = {};
      let parsedEmotional = {};

      try {
        parsedBehavioral = JSON.parse(behavioralPatterns);
      } catch {
        throw new SyntaxError("behavioral");
      }

      try {
        parsedEmotional = JSON.parse(emotionalState);
      } catch {
        throw new SyntaxError("emotional");
      }

      const payload = {
        name,
        birth_date: birthDate,
        age: calculateAge(birthDate),
        gender,
        behavioral_patterns: parsedBehavioral,
        emotional_state: parsedEmotional
      };

      if (profile?.child_id) {
        await axiosInstance.put(`/auth/child/${profile.child_id}`, payload);
      } else {
        await axiosInstance.post("/auth/child/", payload);
      }

      setSuccessMessage(profile?.child_id ? "Profile updated!" : "Profile created!");
      setTimeout(() => {
        onSave();
        setSuccessMessage("");
      }, 2000);
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        setError({
          ...error,
          behavioral: err.message === "behavioral" ? "Invalid Behavioral Patterns JSON" : "",
          emotional: err.message === "emotional" ? "Invalid Emotional State JSON" : ""
        });
      } else {
        console.error(err);
        setError({
          ...error,
          general: "Something went wrong. Please try again."
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded">
          {successMessage}
        </div>
      )}

      {/* General Error */}
      {error.general && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded">
          {error.general}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
            bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2
            focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          placeholder="Enter child's name"
          required
          minLength={2}
          maxLength={100}
        />
      </div>

      {/* Birth Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Birth Date</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
            bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2
            focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          required
        />
        {birthDate && (
          <p className="text-sm text-gray-500 mt-1">Calculated Age: {calculateAge(birthDate)}</p>
        )}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
            bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:ring-2
            focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="unspecified">Unspecified</option>
        </select>
      </div>

      {/* Behavioral Patterns JSON */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Behavioral Patterns (JSON)</label>
        <textarea
          value={behavioralPatterns}
          onChange={(e) => setBehavioralPatterns(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
            bg-white/50 dark:bg-gray-700/50 font-mono text-sm min-h-[100px]
            backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
        {error.behavioral && <p className="text-sm text-red-500">{error.behavioral}</p>}
      </div>

      {/* Emotional State JSON */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emotional State (JSON)</label>
        <textarea
          value={emotionalState}
          onChange={(e) => setEmotionalState(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
            bg-white/50 dark:bg-gray-700/50 font-mono text-sm min-h-[100px]
            backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
        />
        {error.emotional && <p className="text-sm text-red-500">{error.emotional}</p>}
      </div>

      {/* Buttons */}
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
          className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white
            rounded-lg shadow hover:shadow-md transition-all duration-200 flex items-center
            ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
                  5.291A7.962 7.962 0 014 12H0c0 3.042 1.135
                  5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </>
          ) : (
            `${profile?.child_id ? "Update" : "Create"} Profile`
          )}
        </button>
      </div>
    </form>
  );
};

export default ChildProfileForm;
