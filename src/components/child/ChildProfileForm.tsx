// front_end/src/components/child/ChildProfileForm.tsx
import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

interface ChildProfile {
  child_id?: number;
  name?: string;
  age?: number;
  gender?: string;
  behavioral_patterns?: any;
  emotional_state?: any;
}

interface Props {
  profile?: ChildProfile | null;
  onSave: () => void;
  onCancel: () => void;
}

const ChildProfileForm: React.FC<Props> = ({ profile, onSave, onCancel }) => {
  const [name, setName] = useState(profile?.name || "");
  const [gender, setGender] = useState(profile?.gender || "unspecified");
  const [birthDate, setBirthDate] = useState(profile?.birth_date?.split("T")[0] || "");
  const [behavioralPatterns, setBehavioralPatterns] = useState(
    JSON.stringify(profile?.behavioral_patterns || {}, null, 2)
  );
  const [emotionalState, setEmotionalState] = useState(
    JSON.stringify(profile?.emotional_state || {}, null, 2)
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        birth_date: birthDate,
        gender,
        behavioral_patterns: JSON.parse(behavioralPatterns),
        emotional_state: JSON.parse(emotionalState)
      };

      if (profile?.child_id) {
        await axiosInstance.put(`/api/auth/child/${profile.child_id}`, payload);
      } else {
        await axiosInstance.post("/api/auth/child", payload);
      }

      onSave();
    } catch (err) {
      setError("Invalid JSON format in patterns or state");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label className="block mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Birth Date</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {profile?.child_id ? "Update" : "Create"} Profile
        </button>
      </div>
    </form>
  );
};

export default ChildProfileForm;