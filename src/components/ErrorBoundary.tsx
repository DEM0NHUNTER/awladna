// front_end/src/components/ErrorBoundary.tsx
import React, { useState, useEffect } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, []);

  return hasError ? (
    <div className="flex justify-center items-center h-screen">
      <p className="text-red-600">Something went wrong</p>
    </div>
  ) : (
    <>{children}</>
  );
};

export default ErrorBoundary;