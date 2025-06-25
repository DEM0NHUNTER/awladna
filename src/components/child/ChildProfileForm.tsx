import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

interface ChildProfile {
  child_id?: number;
  name?: string;
  birth_date?: string;
  age?: number;
  gender?: string;
}

interface Props {
  profile?: ChildProfile | null;
  onSave: () => void;
  onCancel: () => void;
}

const ChildProfileForm: React.FC<Props> = ({ profile, onSave, onCancel }) => {
  // Form state
  const [name, setName] = useState(profile?.name || "");
  const [birthDate, setBirthDate] = useState(profile?.birth_date?.split("T")[0] || "");
  const [gender, setGender] = useState(profile?.gender || "unspecified");
  const [behavioralPatterns, setBehavioralPatterns] = useState(
    JSON.stringify(profile?.behavioral_patterns || {}, null, 2)
  );
  const [emotionalState, setEmotionalState] = useState(
    JSON.stringify(profile?.emotional_state || {}, null, 2)
  );

  // UI state
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState({
    general: "",
    behavioral: "",
    emotional: ""
  });

  // Calculate age from birth date
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
    setError({ ...error, general: "" });
    setSuccessMessage("");

    try {
      // Validate JSON fields
      let parsedBehavioral = {};
      let parsedEmotional = {};

      try {
        parsedBehavioral = JSON.parse(behavioralPatterns);
      } catch (err) {
        throw new SyntaxError("behavioral");
      }

      try {
        parsedEmotional = JSON.parse(emotionalState);
      } catch (err) {
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

      // API call based on create/update
      if (profile?.child_id) {
        await axiosInstance.put(`/auth/child/${profile.child_id}`, payload);
      } else {
        await axiosInstance.post("/auth/child/", payload);
      }

      setSuccessMessage(profile?.child_id ? "Profile updated successfully!" : "Profile created successfully!");
      setTimeout(() => {
        onSave();
        setSuccessMessage("");
      }, 2000);

    } catch (err: any) {
      if (err instanceof SyntaxError) {
        if (err.message === "behavioral") {
          setError({
            ...error,
            behavioral: "Invalid JSON format for Behavioral Patterns"
          });
        } else if (err.message === "emotional") {
          setError({
            ...error,
            emotional: "Invalid JSON format for Emotional State"
          });
        }
      } else {
        setError({
          ...error,
          general: "Failed to save profile. Please check your inputs and try again."
        });
        console.error("Profile save error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setName(profile?.name || "");
    setBirthDate(profile?.birth_date?.split("T")[0] || "");
    setGender(profile?.gender || "unspecified");
    setBehavioralPatterns(JSON.stringify(profile?.behavioral_patterns || {}, null, 2));
    setEmotionalState(JSON.stringify(profile?.emotional_state || {}, null, 2));
    setError({ general: "", behavioral: "", emotional: "" });
    setSuccessMessage("");
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3">
          {successMessage}
        </div>
      )}

      {/* General Error */}
      {error.general && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
          {error.general}
        </div>
      )}

      {/* Name Field */}
      <div>
        <label className="block mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200"
          required
          minLength={2}
          maxLength={100}
        />
      </div>

      {/* Birth Date Field */}
      <div>
        <label className="block mb-1">Birth Date</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200"
          required
        />
        {birthDate && (
          <p className="text-sm text-gray-500 mt-1">Calculated Age: {calculateAge(birthDate)}</p>
        )}
      </div>

      {/* Gender Field */}
      <div>
        <label className="block mb-1">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="unspecified">Unspecified</option>
        </select>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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