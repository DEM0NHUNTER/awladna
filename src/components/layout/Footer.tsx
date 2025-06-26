import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-black text-white py-4 text-center border-t border-gray-700">
      <p className="text-sm md:text-base">
        © {year} Awladna. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;