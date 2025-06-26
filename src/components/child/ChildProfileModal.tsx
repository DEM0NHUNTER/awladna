import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Modal from "../Modal";

interface ChildProfile {
  child_id?: number;
  name?: string;
  birth_date?: string;
  age?: number;
  gender?: string;
  behavioral_patterns?: object;
  emotional_state?: object;
}

interface RawProps {
  profile?: ChildProfile | null;
  onSave: () => void;
  onCancel: () => void;
}

/**
 * Combined component:
 * - Manages open/close state via modal wrapper
 * - Contains full form logic inside the modal
 */
const ChildProfileForm: React.FC<RawProps> = ({ profile, onSave, onCancel }) => {
  const [isOpen, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onCancel();
  };

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
  const [error, setError] = useState({ general: "", behavioral: "", emotional: "" });

  const calculateAge = (birth: string): number => {
    if (!birth) return 0;
    const today = new Date();
    const b = new Date(birth);
    let age = today.getFullYear() - b.getFullYear();
    if (
      today.getMonth() < b.getMonth() ||
      (today.getMonth() === b.getMonth() && today.getDate() < b.getDate())
    ) {
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
      let parsedBehavioral = {}, parsedEmotional = {};

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
        emotional_state: parsedEmotional,
      };

      if (profile?.child_id) {
        await axiosInstance.put(`/auth/child/${profile.child_id}`, payload);
      } else {
        await axiosInstance.post("/auth/child/", payload);
      }

      setSuccessMessage(profile?.child_id ? "Profile updated successfully!" : "Profile created successfully!");
      setTimeout(() => {
        onSave();
        setOpen(false);
        setSuccessMessage("");
      }, 1500);
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        setError({
          ...error,
          [err.message]: `Invalid JSON format for ${err.message === "behavioral" ? "Behavioral Patterns" : "Emotional State"}`,
        });
      } else {
        setError({ ...error, general: "Failed to save profile. Please check your inputs and try again." });
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(profile?.name || "");
    setBirthDate(profile?.birth_date?.split("T")[0] || "");
    setGender(profile?.gender || "unspecified");
    setBehavioralPatterns(JSON.stringify(profile?.behavioral_patterns || {}, null, 2));
    setEmotionalState(JSON.stringify(profile?.emotional_state || {}, null, 2));
    setError({ general: "", behavioral: "", emotional: "" });
    setSuccessMessage("");
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h3 className="text-xl font-semibold mb-4">
        {profile ? "Edit" : "New"} Child Profile
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3">
            {successMessage}
          </div>
        )}
        {error.general && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3">
            {error.general}
          </div>
        )}

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
            <p className="text-sm text-gray-500 mt-1">
              Calculated Age: {calculateAge(birthDate)}
            </p>
          )}
        </div>

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

        <div>
          <label className="block mb-1">Behavioral Patterns (JSON)</label>
          <textarea
            value={behavioralPatterns}
            onChange={(e) => setBehavioralPatterns(e.target.value)}
            className="w-full p-2 border rounded font-mono text-sm focus:ring-2 focus:ring-blue-200"
            rows={4}
          />
          {error.behavioral && (
            <p className="text-red-600 text-sm">{error.behavioral}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Emotional State (JSON)</label>
          <textarea
            value={emotionalState}
            onChange={(e) => setEmotionalState(e.target.value)}
            className="w-full p-2 border rounded font-mono text-sm focus:ring-2 focus:ring-blue-200"
            rows={4}
          />
          {error.emotional && (
            <p className="text-red-600 text-sm">{error.emotional}</p>
          )}
        </div>

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
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
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
    </Modal>
  );
};

export default ChildProfileForm;
