import React from "react";

const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <div className="flex justify-center items-center">
    <div
      className="animate-spin rounded-full border-t-2 border-b-2 border-blue-600"
      style={{ width: size, height: size }}
    ></div>
  </div>
);

export default LoadingSpinner;
