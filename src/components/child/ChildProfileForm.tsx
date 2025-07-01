// src/components/child/ChildProfileForm.tsx
import React from 'react';

interface ChildProfileFormProps {
  formData: {
    name?: string;
    age?: number | string;
    gender?: 'Male' | 'Female';
    school?: string;
    challenges?: string;
  };
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const ChildProfileForm: React.FC<ChildProfileFormProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name<span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name || ''}
          onChange={onChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
          Age<span className="text-red-500">*</span>
        </label>
        <input
          id="age"
          name="age"
          type="number"
          min={0}
          value={formData.age ?? ''}
          onChange={onChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
          Gender<span className="text-red-500">*</span>
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender || ''}
          onChange={onChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <option value="" disabled>
            Select gender…
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      <div>
        <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
          School
        </label>
        <input
          id="school"
          name="school"
          type="text"
          value={formData.school || ''}
          onChange={onChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>

      <div>
        <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 mb-1">
          Challenges / Notes
        </label>
        <textarea
          id="challenges"
          name="challenges"
          rows={3}
          value={formData.challenges || ''}
          onChange={onChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>
    </div>
  );
};

export default ChildProfileForm;
