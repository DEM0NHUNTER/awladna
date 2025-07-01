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

  componentDidCatch(error: Error) {
    console.error("RegisterForm error:", error);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Check console for details.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;