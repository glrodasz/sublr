import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ maxWidth: 480, margin: "80px auto", padding: "0 20px" }}>
          <h1 style={{ fontSize: "1.4rem", marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ color: "var(--fg-1, #b8b8c8)", marginBottom: 16 }}>
            An unexpected error occurred. Reloading the page usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid var(--line-strong, #3a3a4d)",
              background: "var(--bg-2, #1c1c26)",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
