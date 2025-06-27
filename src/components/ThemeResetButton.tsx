// front_end/src/components/ThemeResetButton.tsx
import React from "react";
import axiosInstance from "@/api/axiosInstance";
import { useLanguage } from "@/context/LanguageContext";

const ThemeResetButton: React.FC = () => {
  const { setTheme } = useLanguage();

  const handleReset = async () => {
    try {
      const res = await axiosInstance.post("/api/settings/reset-theme", {
        page: "default"
      });
      setTheme(res.data.theme);
      window.location.reload();
    } catch (err) {
      console.error("Theme reset failed", err);
    }
  };

  return (
    <button
      onClick={handleReset}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Reset Theme
    </button>
  );
};

export default ThemeResetButton;