import React, { useEffect, useMemo, useRef, useState } from "react";
import Tag from "./Tag";
import { normalizeTag } from "../lib/normalizeTag";

interface Props {
  values: string[];
  setValues: (next: string[]) => void;
  options?: string[];
  creatable?: boolean;
  placeholder?: string;
}

const TagsInput = ({ values, setValues, options = [], creatable = false, placeholder }: Props) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const normalizedValues = useMemo(() => values.map(normalizeTag), [values]);

  const filteredOptions = useMemo(() => {
    const q = normalizeTag(query);
    return options
      .map(normalizeTag)
      .filter((o, i, a) => o && a.indexOf(o) === i)
      .filter((o) => !normalizedValues.includes(o))
      .filter((o) => (q ? o.includes(q) : true));
  }, [options, query, normalizedValues]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  const commit = (raw: string): boolean => {
    const next = normalizeTag(raw);
    if (!next) return false;
    if (normalizedValues.includes(next)) return false;
    if (!creatable && !options.map(normalizeTag).includes(next)) return false;
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

  return (
    <div
      ref={containerRef}
      className={`tags-input ${open ? "is-open" : ""}`}
      onClick={(event) => {
        event.stopPropagation();
        setOpen(true);
        inputRef.current?.focus();
      }}
    >
      {values.map((tag, i) => (
        <Tag
          key={`${tag}-${i}`}
          onClose={(event) => {
            event.stopPropagation();
            removeAt(i);
          }}
        >
          {tag}
        </Tag>
      ))}
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
      {open && filteredOptions.length > 0 && (
        <ul className="ti-options" role="listbox">
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
        </ul>
      )}
      <style jsx>{`
        .tags-input {
          position: relative;
          display: inline-flex;
          flex-wrap: wrap;
          gap: 6px;
          min-height: var(--input-height, 40px);
          align-items: center;
          min-width: 200px;
          max-width: 520px;
          background: var(--bg-1, #14141b);
          border: 1px solid var(--line-strong, #3a3a4d);
          border-radius: var(--r-sm, 6px);
          padding: 4px 8px;
          cursor: text;
        }

        .tags-input.is-open,
        .tags-input:focus-within {
          border-color: var(--accent, #7cffb2);
          box-shadow: 0 0 0 1px var(--accent, #7cffb2);
        }

        .ti-input {
          flex: 1 1 80px;
          min-width: 60px;
          width: auto;
          height: 32px;
          border: none;
          background: transparent;
          color: var(--fg-0, #f5f5fa);
          font-size: 0.9rem;
          outline: none;
          padding: 0 4px;
        }

        .ti-input::placeholder {
          color: var(--fg-2, #6e6e85);
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

        .ti-options button {
          display: block;
          width: 100%;
          text-align: left;
          background: transparent;
          border: 0;
          padding: 10px 12px;
          color: var(--fg-0, #f5f5fa);
          font: inherit;
          font-size: 0.9rem;
          text-transform: capitalize;
          cursor: pointer;
        }

        .ti-options button:hover,
        .ti-options button:focus-visible {
          background: var(--bg-3, #242433);
          color: var(--accent, #7cffb2);
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default TagsInput;
