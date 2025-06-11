import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-center text-gray-500 py-4 border-t mt-10">
      © {new Date().getFullYear()} Awladna. All rights reserved.
    </footer>
  );
};

export default Footer;
