import React from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../api/axiosInstance";

interface Props {
  profile: any;
  onSave: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  age: number;
  gender: string;
}

const ChildProfileForm: React.FC<Props> = ({ profile, onSave, onCancel }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: profile || {},
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (profile) {
        await axiosInstance.put(`/auth/child/${profile.child_id}`, data);
      } else {
        await axiosInstance.post("/auth/child/", data);
      }
      onSave();
    } catch (err) {
      alert("Failed to save profile");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input {...register("name", { required: true })} className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {errors.name && <p className="text-red-500 text-xs mt-1">Name is required.</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Age</label>
        <input type="number" {...register("age", { required: true, min: 0 })} className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {errors.age && <p className="text-red-500 text-xs mt-1">Valid age is required.</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Gender</label>
        <select {...register("gender", { required: true })} className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <p className="text-red-500 text-xs mt-1">Gender is required.</p>}
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          {profile ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default ChildProfileForm;
