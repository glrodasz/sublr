interface Props {
  label: string;
  color?: string;
}

export function Badge({ label, color }: Props) {
  return (
    <span className="badge">
      {label}
      <style jsx>{`
        .badge {
          display: inline-flex;
          align-items: center;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 6px;
          background: var(--bg-2);
          color: ${color ?? "var(--fg-2)"};
          border: 1px solid var(--line);
          white-space: nowrap;
          flex-shrink: 0;
        }
      `}</style>
    </span>
  );
}
