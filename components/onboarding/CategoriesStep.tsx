import { useState, useRef } from "react";
import { useCategories } from "../../hooks/useCategories";
import type { Domain } from "../../types";

const SECTIONS: { domain: Domain; label: string; icon: string }[] = [
  { domain: "INCOME", label: "Incomes", icon: "💰" },
  { domain: "EXPENSE", label: "Expenses", icon: "🧾" },
  { domain: "INVESTMENT", label: "Investments", icon: "📈" },
  { domain: "SAVING", label: "Savings", icon: "🏦" },
];

interface Props {
  onNext: () => void;
}

function CategorySection({ domain, label, icon }: { domain: Domain; label: string; icon: string }) {
  const { categories, create, remove } = useCategories(domain);
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = async (value: string) => {
    const name = value.trim();
    if (name) {
      await create({ domain, name }).catch(console.error);
    }
    if (inputRef.current) inputRef.current.value = "";
    inputRef.current?.focus();
  };

  return (
    <div className="section">
      <h3 className="section-heading">
        <span className="section-icon">{icon}</span>
        {label}
      </h3>
      <div className="chips">
        {categories.map((cat) => (
          <span key={cat.id} className="chip chip--filled">
            {cat.name}
            <button
              type="button"
              className="chip-remove"
              aria-label={`Remove ${cat.name}`}
              onClick={() => cat.id && remove(cat.id).catch(console.error)}
            >
              ×
            </button>
          </span>
        ))}
        {adding ? (
          <span className="chip chip--input">
            <input
              ref={inputRef}
              autoFocus
              className="chip-input"
              placeholder="Category name"
              onKeyDown={(e) => {
                if (e.key === "Enter") commit(e.currentTarget.value);
                if (e.key === "Escape") setAdding(false);
              }}
              onBlur={(e) => {
                if (e.currentTarget.value.trim()) {
                  commit(e.currentTarget.value).then(() => setAdding(false));
                } else {
                  setAdding(false);
                }
              }}
            />
          </span>
        ) : (
          <button type="button" className="chip chip--add" onClick={() => setAdding(true)}>
            + Add category
          </button>
        )}
      </div>

      <style jsx>{`
        .section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .section-heading {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--fg-0, #f0f0f5);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-icon {
          font-size: 1rem;
        }

        .chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 0.85rem;
          font-family: inherit;
          cursor: default;
          border: none;
        }

        .chip--filled {
          background: #1a1a2e;
          color: #e0e0ef;
          border: 1px solid #2a2a48;
        }

        .chip--input {
          background: #1a1a2e;
          border: 1px solid #7c7cff;
          padding: 4px 12px;
        }

        .chip--add {
          background: #f0f0f0;
          color: #333;
          cursor: pointer;
          font-size: 0.85rem;
          font-family: inherit;
        }

        .chip--add:hover {
          background: #e0e0e0;
        }

        .chip-remove {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
          padding: 0;
          margin-left: 2px;
        }

        .chip-remove:hover {
          color: #ff5555;
        }

        .chip-input {
          background: none;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: 0.85rem;
          color: #e0e0ef;
          width: 120px;
        }
      `}</style>
    </div>
  );
}

export function CategoriesStep({ onNext }: Props) {
  return (
    <div className="step">
      <h2 className="step-title">Set up your categories</h2>
      <p className="step-desc">
        These are the buckets you&apos;ll use to organise your finances. Defaults are provided — add
        or remove as needed.
      </p>

      <div className="sections">
        {SECTIONS.map((s) => (
          <CategorySection key={s.domain} {...s} />
        ))}
      </div>

      <div className="actions">
        <button type="button" className="btn-next" onClick={onNext}>
          Next →
        </button>
      </div>

      <style jsx>{`
        .step {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .step-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--fg-0, #f0f0f5);
        }

        .step-desc {
          margin: 0;
          font-size: 0.9rem;
          color: var(--fg-1, #b8b8c8);
        }

        .sections {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          padding-top: 8px;
        }

        .btn-next {
          padding: 10px 28px;
          border-radius: 999px;
          border: none;
          background: var(--accent, #7cffb2);
          color: #0a0a0f;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-next:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
