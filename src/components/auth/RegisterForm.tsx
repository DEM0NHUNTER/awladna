// src/components/RegisterForm.tsx

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext"; // ✅ correct
import { format } from "date-fns";
import toast from "react-hot-toast";

const RegisterForm: React.FC = () => {
  const { children } = useAuth();
  const [formState, setFormState] = useState({ name: "", email: "" });

  const firstChild = children?.[0];

  // ✅ Safely format the birth_date if available
  const formattedDate = firstChild?.birth_date
    ? format(new Date(firstChild.birth_date), "yyyy-MM-dd")
    : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Simulated request
      console.log("Registering user with:", formState);

      toast.success("Registered successfully!");
    } catch (err) {
      toast.error("Registration failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={formState.name}
          onChange={(e) =>
            setFormState({ ...formState, name: e.target.value })
          }
          className="border rounded p-2 w-full"
          required
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formState.email}
          onChange={(e) =>
            setFormState({ ...formState, email: e.target.value })
          }
          className="border rounded p-2 w-full"
          required
        />
      </div>

      {firstChild && (
        <div className="text-sm text-gray-600">
          First child: <strong>{firstChild.name}</strong> <br />
          Birth date: <strong>{formattedDate || "N/A"}</strong>
        </div>
      )}

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
