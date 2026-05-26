import React, { useEffect, useMemo, useRef, useState } from "react";
import Tag from "./Tag";
import { normalizeTag } from "../lib/normalizeTag";

interface Props {
  values: string[];
  setValues: (next: string[]) => void;
  options?: string[];
  creatable?: boolean;
  placeholder?: string;
  collapse?: boolean;
  maxVisible?: number;
}

const TagsInput = ({
  values,
  setValues,
  options = [],
  creatable = false,
  placeholder,
  collapse = false,
  maxVisible = 2,
}: Props) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLLIElement>(null);
  const [scrollToSelected, setScrollToSelected] = useState(false);

  const normalizedValues = useMemo(() => values.map(normalizeTag), [values]);

  const availableOptions = useMemo(
    () => options.map(normalizeTag).filter((o, i, a) => o && a.indexOf(o) === i),
    [options]
  );

  const filteredOptions = useMemo(() => {
    const q = normalizeTag(query);
    return availableOptions
      .filter((o) => !normalizedValues.includes(o))
      .filter((o) => (q ? o.includes(q) : true));
  }, [availableOptions, query, normalizedValues]);

  const normalizedQuery = normalizeTag(query);
  const canCreate =
    creatable &&
    !!normalizedQuery &&
    !normalizedValues.includes(normalizedQuery) &&
    !availableOptions.includes(normalizedQuery);

  const allSelected =
    !creatable &&
    availableOptions.length > 0 &&
    availableOptions.every((o) => normalizedValues.includes(o));

  const showInput = !(collapse && allSelected);
  const visibleValues = collapse ? values.slice(0, maxVisible) : values;
  const hiddenCount = collapse ? values.length - visibleValues.length : 0;

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (open && scrollToSelected && selectedRef.current) {
      selectedRef.current.scrollIntoView?.({ block: "nearest" });
      setScrollToSelected(false);
    }
  }, [open, scrollToSelected]);

  const commit = (raw: string): boolean => {
    const next = normalizeTag(raw);
    if (!next) return false;
    if (normalizedValues.includes(next)) return false;
    if (!creatable && !availableOptions.includes(next)) return false;
    setValues([...values, next]);
    setQuery("");
    return true;
  };

  const removeAt = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const candidate = event.key === "," ? query : (filteredOptions[0] ?? query);
      commit(candidate);
      return;
    }
    if (event.key === "Backspace" && query === "" && values.length > 0) {
      event.preventDefault();
      removeAt(values.length - 1);
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  const showSelectedGroup = collapse && values.length > 0;

  return (
    <div className="tags-field">
      <div
        ref={containerRef}
        className={`tags-input ${open ? "is-open" : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        {visibleValues.map((tag, i) => (
          <Tag
            key={`${tag}-${i}`}
            truncate={collapse ? 7 : undefined}
            onClose={(event) => {
              event.stopPropagation();
              removeAt(i);
            }}
          >
            {tag}
          </Tag>
        ))}
        {hiddenCount > 0 && (
          <button
            type="button"
            className="more"
            onClick={(event) => {
              event.stopPropagation();
              setOpen(true);
              setScrollToSelected(true);
            }}
          >
            +{hiddenCount} more
          </button>
        )}
        {showInput && (
          <input
            ref={inputRef}
            type="text"
            className="ti-input"
            value={query}
            placeholder={values.length === 0 ? placeholder : ""}
            aria-label={placeholder ?? "Tags"}
            onFocus={() => setOpen(true)}
            onChange={(event) => setQuery(event.currentTarget.value)}
            onKeyDown={handleKeyDown}
          />
        )}
        {open && (showSelectedGroup || filteredOptions.length > 0 || canCreate) && (
          <ul className="ti-options" role="listbox">
            {canCreate && (
              <li role="option" aria-selected="false">
                <button
                  type="button"
                  className="ti-create"
                  onClick={(event) => {
                    event.stopPropagation();
                    commit(query);
                    inputRef.current?.focus();
                  }}
                >
                  Create “{normalizedQuery}”
                </button>
              </li>
            )}
            {filteredOptions.length > 0 && (
              <>
                {showSelectedGroup && (
                  <li className="ti-group" aria-hidden>
                    Add
                  </li>
                )}
                {filteredOptions.map((option) => (
                  <li key={option} role="option" aria-selected="false">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        commit(option);
                        inputRef.current?.focus();
                      }}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </>
            )}
            {showSelectedGroup && (
              <>
                <li
                  ref={selectedRef}
                  className={`ti-group ${filteredOptions.length > 0 ? "with-divider" : ""}`}
                  aria-hidden
                >
                  Selected
                </li>
                {values.map((tag, i) => (
                  <li key={`sel-${tag}-${i}`} role="option" aria-selected="true">
                    <button
                      type="button"
                      className="ti-selected"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeAt(i);
                      }}
                    >
                      <span>{tag}</span>
                      <span className="x" aria-hidden>
                        ×
                      </span>
                    </button>
                  </li>
                ))}
              </>
            )}
          </ul>
        )}
      </div>
      {collapse && values.length > 0 && (
        <button
          type="button"
          className="clear-all"
          onClick={(event) => {
            event.stopPropagation();
            setValues([]);
            setQuery("");
          }}
        >
          Clear all
        </button>
      )}
      <style jsx>{`
        .tags-field {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }

        .tags-input {
          position: relative;
          display: inline-flex;
          flex-wrap: wrap;
          gap: 6px;
          min-height: var(--input-height, 40px);
          align-items: center;
          min-width: 150px;
          max-width: 360px;
          background: var(--bg-1, #14141b);
          border: 1px solid var(--line-strong, #3a3a4d);
          border-radius: var(--r-sm, 6px);
          padding: 4px 8px;
          cursor: text;
        }

        .tags-input.is-open,
        .tags-input:focus-within {
          border-color: var(--accent, #7cffb2);
        }

        .tags-input .ti-input {
          flex: 1 1 80px;
          min-width: 60px;
          width: auto;
          height: 30px;
          border: none;
          box-shadow: none;
          background: transparent;
          color: var(--fg-0, #f5f5fa);
          font-size: 0.9rem;
          outline: none;
          padding: 0 4px;
        }

        .tags-input .ti-input:focus {
          border: none;
          box-shadow: none;
          outline: none;
        }

        .ti-input::placeholder {
          color: var(--fg-2, #6e6e85);
        }

        .more {
          flex: 0 0 auto;
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 999px;
          border: 1px solid var(--line-strong, #3a3a4d);
          background: var(--bg-2, #1c1c26);
          color: var(--fg-1, #b8b8c8);
          cursor: pointer;
          white-space: nowrap;
        }

        .clear-all {
          align-self: flex-start;
          font-family: inherit;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          background: transparent;
          border: none;
          padding: 0 2px;
          color: var(--fg-2, #6e6e85);
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .clear-all:hover {
          color: var(--accent, #7cffb2);
        }

        .ti-options {
          list-style: none;
          margin: 0;
          padding: 6px 0;
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: var(--bg-2, #1c1c26);
          border: 1px solid var(--line-strong, #3a3a4d);
          border-radius: var(--r-sm, 6px);
          box-shadow: 0 16px 32px rgb(0 0 0 / 0.45);
          z-index: 20;
          max-height: 260px;
          overflow-y: auto;
        }

        .ti-group {
          padding: 5px 12px 3px;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--fg-2, #6e6e85);
        }

        .ti-group.with-divider {
          margin-top: 4px;
          padding-top: 8px;
          border-top: 1px solid var(--line, #2a2a38);
        }

        .ti-options button {
          display: block;
          width: 100%;
          text-align: left;
          background: transparent;
          border: 0;
          padding: 6px 12px;
          color: var(--fg-0, #f5f5fa);
          font: inherit;
          font-size: 0.9rem;
          text-transform: capitalize;
          cursor: pointer;
        }

        .ti-options button.ti-create {
          text-transform: none;
          color: var(--accent, #7cffb2);
          font-weight: 600;
        }

        .ti-options button.ti-selected {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: var(--fg-1, #b8b8c8);
        }

        .ti-options button.ti-selected .x {
          font-size: 1.1rem;
          line-height: 1;
          color: var(--fg-2, #6e6e85);
        }

        .ti-options button:hover,
        .ti-options button:focus-visible {
          background: var(--bg-3, #242433);
          color: var(--accent, #7cffb2);
          outline: none;
        }

        .ti-options button.ti-selected:hover .x {
          color: var(--accent, #7cffb2);
        }
      `}</style>
    </div>
  );
};

export default TagsInput;
