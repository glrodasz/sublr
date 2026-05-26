import React from "react";
import type { FieldChange } from "../types";

interface Option {
  label: string;
  value: string;
}

interface Props {
  id: string;
  options: Option[];
  value?: string;
  onChange: (change: FieldChange) => void;
}

const Toggle = ({ id, options, value, onChange }: Props) => {
  return (
    <div className="toggle" role="radiogroup" aria-label={id}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            className={`segment ${isActive ? "is-active" : ""}`}
            onClick={(event) => {
              event.stopPropagation();
              onChange({ id, value: option.value });
            }}
          >
            {option.label}
          </button>
        );
      })}
      <style jsx>{`
        .toggle {
          display: inline-flex;
          padding: 3px;
          gap: 3px;
          border: 1px solid var(--line, #2a2a38);
          border-radius: 999px;
          background: var(--bg-2, #1c1c26);
        }

        .segment {
          appearance: none;
          border: none;
          cursor: pointer;
          padding: 5px 14px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--fg-1, #b8b8c8);
          background: transparent;
          transition:
            background 0.15s ease,
            color 0.15s ease;
        }

        .segment:hover {
          color: var(--fg-0, #f5f5fa);
        }

        .segment.is-active {
          color: #0a0a0f;
          background: var(--accent, #7cffb2);
        }
      `}</style>
    </div>
  );
};

export default Toggle;
