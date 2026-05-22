import React from "react";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  options?: Option[];
  hideLabel?: boolean;
  value?: string;
  setValue?: (value: string) => void;
  isHiddenInMobile?: boolean;
  children?: React.ReactNode;
  variant?: "select" | "segmented";
}

const Filter = ({
  label,
  options,
  hideLabel,
  value,
  setValue,
  isHiddenInMobile,
  children,
  variant = "select",
}: Props) => {
  if (children) {
    return (
      <>
        <div className={`filter ${isHiddenInMobile ? "is-hidden-in-mobile" : ""}`}>
          {!hideLabel && <label className="filter-label">{label}</label>}
          {children}
        </div>
        <style jsx>{`
          .filter {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--fg-1, #b8b8c8);
          }

          .filter-label {
            font-weight: 600;
            font-size: 0.65rem;
            font-family: var(--font-mono, ui-monospace, monospace);
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--fg-2, #6e6e85);
            white-space: nowrap;
          }

          @media (max-width: 799px) {
            .is-hidden-in-mobile {
              display: none;
            }
          }
        `}</style>
      </>
    );
  }

  if (variant === "segmented" && options?.length) {
    return (
      <>
        <div className={`filter filter-segmented ${isHiddenInMobile ? "is-hidden-in-mobile" : ""}`}>
          {!hideLabel && <span className="filter-label">{label}</span>}
          <div className="segmented" role="group" aria-label={label}>
            {options.map((option) => {
              const isActive = String(value) === String(option.value);
              return (
                <button
                  type="button"
                  key={option.label}
                  className={isActive ? "seg active" : "seg"}
                  onClick={() => setValue?.(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
        <style jsx>{`
          .filter-segmented {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .filter-label {
            font-weight: 600;
            font-size: 0.65rem;
            font-family: var(--font-mono, ui-monospace, monospace);
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--fg-2, #6e6e85);
          }

          .segmented {
            display: inline-flex;
            flex-wrap: wrap;
            padding: 3px;
            background: var(--bg-1, #14141b);
            border: 1px solid var(--line-strong, #3a3a4d);
            border-radius: 999px;
            gap: 2px;
          }

          .seg {
            font-family: inherit;
            font-size: 0.8rem;
            font-weight: 600;
            padding: 6px 12px;
            border: none;
            border-radius: 999px;
            cursor: pointer;
            background: transparent;
            color: var(--fg-1, #b8b8c8);
            transition:
              background 0.15s ease,
              color 0.15s ease;
          }

          .seg:hover {
            color: var(--fg-0, #f5f5fa);
            background: var(--bg-2, #1c1c26);
          }

          .seg.active {
            color: #0a0a0f;
            background: var(--accent, #7cffb2);
          }

          @media (max-width: 799px) {
            .is-hidden-in-mobile {
              display: none;
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div className={`filter ${isHiddenInMobile ? "is-hidden-in-mobile" : ""}`}>
        {!hideLabel && <label className="filter-label">{label}</label>}

        <div className="select-wrap">
          <select value={value} onChange={(event) => setValue?.(event.currentTarget.value)}>
            {options?.map((option) => {
              return (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <style jsx>{`
        .filter {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--fg-1, #b8b8c8);
        }

        .filter-label {
          font-weight: 600;
          font-size: 0.65rem;
          font-family: var(--font-mono, ui-monospace, monospace);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--fg-2, #6e6e85);
          white-space: nowrap;
        }

        .select-wrap {
          position: relative;
        }

        .select-wrap :global(select) {
          min-width: 100px;
          padding: 6px 32px 6px 12px;
          font-size: 0.85rem;
          border: 1px solid var(--line, #2a2a38);
          background: var(--bg-1, #14141b);
          color: var(--fg-0, #f5f5fa);
          border-radius: var(--r-sm, 6px);
          cursor: pointer;
          appearance: none;
          background-image:
            linear-gradient(45deg, transparent 50%, var(--fg-2) 50%),
            linear-gradient(135deg, var(--fg-2) 50%, transparent 50%);
          background-position:
            calc(100% - 12px) 50%,
            calc(100% - 7px) 50%;
          background-size:
            4px 4px,
            4px 4px;
          background-repeat: no-repeat;
        }

        .select-wrap :global(select:focus) {
          outline: none;
          border-color: var(--accent, #7cffb2);
          box-shadow: 0 0 0 1px var(--accent, #7cffb2);
        }

        @media (max-width: 799px) {
          .is-hidden-in-mobile {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Filter;
