// front_end/src/components/ThemeBuilder.tsx
import React, { useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useLanguage } from "@/context/LanguageContext";

const ThemeBuilder: React.FC = () => {
  const { getScopedTheme, resetTheme } = useLanguage();
  const [page, setPage] = useState("default");

  const [theme, setTheme] = useState(getScopedTheme(page));

  const saveTheme = async () => {
    try {
      await axiosInstance.post("/api/settings/customize-theme", {
        theme,
        page
      });
      alert("Theme saved!");
    } catch (err) {
      console.error("Theme save failed", err);
    }
  };

  return (
    <div className="theme-builder">
      <div className="flex gap-2 mb-4">
        <select value={page} onChange={(e) => setPage(e.target.value)}>
          <option value="default">Default</option>
          <option value="dashboard">Dashboard</option>
          <option value="analytics">Analytics</option>
        </select>

        <button onClick={() => resetTheme(page)}>Reset</button>
        <button onClick={saveTheme}>Save</button>
      </div>

      <div className="theme-controls">
        <div className="mb-4">
          <label>Primary Color</label>
          <input
            type="color"
            value={theme.primary}
            onChange={(e) => setTheme({...theme, primary: e.target.value})}
          />
        </div>

        <div className="mb-4">
          <label>Secondary Color</label>
          <input
            type="color"
            value={theme.secondary}
            onChange={(e) => setTheme({...theme, secondary: e.target.value})}
          />
        </div>
      </div>
    </div>
  );
};