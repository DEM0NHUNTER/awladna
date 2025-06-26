import React, { useState } from "react";
import ChildProfileForm from "../components/child/ChildProfileForm";

export default function ChildPopup({ show, onClose, profile, onSave }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-30"
        onClick={onClose}
      />
      <div
        data-aos="fade-up"
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full transform transition-transform"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          {profile ? "Edit Child Profile" : "Create Child Profile"}
        </h2>
        <ChildProfileForm
          profile={profile}
          onSave={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
