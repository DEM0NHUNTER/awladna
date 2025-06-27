// front_end/src/components/LanguageToggle.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", i18n.dir());

    // Notify context
    window.dispatchEvent(new Event("languagechange"));
  };

  return (
    <div className="language-toggle flex gap-2">
      <button
        onClick={() => handleChange("en")}
        className={`px-4 py-2 rounded-md ${
          language === "en"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        English
      </button>

      <button
        onClick={() => handleChange("ar")}
        className={`px-4 py-2 rounded-md ${
          language === "ar"
            ? "bg-green-600 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        العربية
      </button>
    </div>
  );
};