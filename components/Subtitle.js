import React from "react";

const Subtitle = ({ children }) => {
  return (
    <>
      <h2 className="subtitle">
        <span className="text">{children}</span>
        <span className="rule" aria-hidden="true" />
      </h2>
      <style jsx>{`
        .subtitle {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          margin: 0;
          font-size: 0.75rem;
          font-weight: 600;
          font-family: var(--font-mono, ui-monospace, monospace);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--fg-2, #6e6e85);
        }

        .text {
          flex: 0 0 auto;
        }

        .rule {
          flex: 1 1 auto;
          height: 1px;
          background: var(--line, #2a2a38);
          min-width: 24px;
        }
      `}</style>
    </>
  );
};

export default Subtitle;
