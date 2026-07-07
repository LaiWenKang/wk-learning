import { Component, type ReactNode } from "react";

/** Last-resort catch so a rendering bug never leaves a blank screen. */
export class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("WK Learning crashed:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-fallback card">
          <h2 className="card-title">Something went wrong</h2>
          <p className="card-muted" style={{ marginBottom: 12 }}>
            Your data is safe in local storage. Reload to continue.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
