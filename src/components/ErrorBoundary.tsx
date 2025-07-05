// src/components/ErrorBoundary.tsx
import React, { Component } from "react";

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
      console.error("🔥 ErrorBoundary caught an error:", error);
      console.error("🧱 Component Stack:", info.componentStack);
    }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center mt-10 text-red-600">
          <h1 className="text-2xl font-semibold">Something went wrong.</h1>
          <p className="mt-2 text-sm">Please refresh the page or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
