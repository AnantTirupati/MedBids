"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary caught an error]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-on-surface flex flex-col justify-center items-center p-6 text-center select-none">
          <div className="glass-card max-w-md p-8 rounded-card border border-outline flex flex-col gap-6">
            <h1 className="text-display-sm font-bold text-error">Something went wrong</h1>
            <p className="text-body-md text-on-surface-variant">
              An unexpected application error occurred. We have logged this diagnostic information.
            </p>
            {this.state.error && (
              <pre className="p-4 bg-surface-container rounded-xl text-left text-xs overflow-auto max-h-40 border border-outline-variant text-text-muted font-mono">
                {this.state.error.toString()}
              </pre>
            )}
            <Button onClick={this.handleReset} className="w-full">
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
