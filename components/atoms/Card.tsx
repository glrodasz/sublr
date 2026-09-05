import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  accentColor?: string;
  className?: string;
}

export function Card({ children, accentColor, className }: Props) {
  return (
    <div className={`card${className ? ` ${className}` : ""}`}>
      {children}
      <style jsx>{`
        .card {
          background: var(--bg-1);
          border: 1px solid var(--line);
          border-top: 3px solid ${accentColor ?? "transparent"};
          border-radius: var(--r-lg);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
          min-width: 0;
        }
      `}</style>
    </div>
  );
}
