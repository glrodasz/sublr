import React, { useEffect, useRef, useState } from "react";
import Tag from "./Tag";

const pluralize = (length: number, word: string): string => (length === 1 ? word : `${word}s`);

const MORE_KEY = Symbol("more");
type TagValue = string | typeof MORE_KEY;
type SummaryEntry = { label: string | false; value: TagValue; isLowerCase?: boolean };

interface Props {
  options: string[];
  values: string | string[];
  setValues: (values: string[]) => void;
}

const Autocomplete = ({ options, values, setValues }: Props) => {
  const [isEditable, setIsEditable] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const valueList = Array.isArray(values) ? values : values ? [values] : [];

  const fileteredOptions = options
    .filter((option) => !valueList.includes(option))
    .filter((option) => {
      if (query?.length) {
        return option.includes(query.toLocaleLowerCase());
      }
      return option;
    });

  useEffect(() => {
    const closeOptions = () => {
      setIsEditable(false);
      setQuery("");
    };
    window.addEventListener("click", closeOptions);
    return () => window.removeEventListener("click", closeOptions);
  }, []);

  const hasValues = !!valueList.length;
  const [firstTag, secondTag, ...restTags] = valueList;
  const tags = restTags;
  const summaryValues: SummaryEntry[] = [
    { label: firstTag, value: firstTag },
    { label: secondTag, value: secondTag },
    {
      label: !!tags.length && `${tags.length} more ${pluralize(tags.length, "tag")}`,
      value: MORE_KEY,
      isLowerCase: true,
    },
  ];

  const handlerCloseTag = (valueToRemove: TagValue) => (event: React.MouseEvent) => {
    event.stopPropagation();

    if (valueToRemove === MORE_KEY) {
      setValues([firstTag, secondTag].filter(Boolean));
    } else {
      setValues(valueList.filter((value) => value !== valueToRemove));
    }
  };

  if (isEditable) {
    return (
      <>
        <div
          className="container"
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current?.focus();
          }}
        >
          {!!valueList?.length &&
            summaryValues
              .filter(({ label }) => Boolean(label))
              .map(({ value, label, isLowerCase }) => (
                <Tag
                  key={label as string}
                  onClose={handlerCloseTag(value)}
                  isLowerCase={isLowerCase}
                >
                  {label as string}
                </Tag>
              ))}
          <input
            ref={inputRef}
            list="tags"
            type="text"
            autoFocus
            placeholder={!hasValues ? "Search…" : ""}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            className="ac-input"
          />
          {!!fileteredOptions?.length && (
            <div className="options">
              {fileteredOptions.map((item) => (
                <span
                  key={item}
                  onClick={(event) => {
                    event.stopPropagation();
                    setValues([...new Set([...valueList, item])]);
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
        <style jsx>{`
          .container {
            position: relative;
            display: inline-flex;
            flex-wrap: wrap;
            gap: 6px;
            min-height: var(--input-height);
            align-items: center;
            min-width: 200px;
            max-width: 520px;
            background: var(--bg-1, #14141b);
            border: 1px solid var(--line, #2a2a38);
            border-radius: var(--r-sm, 6px);
            padding: 4px 8px;
          }

          .container:focus-within {
            border-color: var(--accent, #7cffb2);
            box-shadow: 0 0 0 1px var(--accent, #7cffb2);
          }

          :global(.ac-input) {
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

          :global(.ac-input::placeholder) {
            color: var(--fg-2, #6e6e85);
          }

          .options {
            background: var(--bg-2, #1c1c26);
            padding: 8px 0;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            margin-top: 4px;
            display: flex;
            flex-direction: column;
            gap: 0;
            border: 1px solid var(--line, #2a2a38);
            border-radius: var(--r-sm, 6px);
            color: var(--fg-0, #f5f5fa);
            cursor: pointer;
            z-index: 20;
            box-shadow: 0 16px 32px rgb(0 0 0 / 0.45);
          }

          .options > span {
            padding: 10px 12px;
            text-transform: capitalize;
            font-size: 0.9rem;
          }

          .options > span:hover {
            background: var(--bg-3, #242433);
            color: var(--accent, #7cffb2);
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <div
        className="autocomplete"
        onClick={(event) => {
          event.stopPropagation();
          setIsEditable(true);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsEditable(true);
          }
        }}
      >
        {!!valueList?.length
          ? summaryValues
              .filter(({ label }) => Boolean(label))
              .map(({ value, label, isLowerCase }) => (
                <Tag
                  key={label as string}
                  onClose={handlerCloseTag(value)}
                  isLowerCase={isLowerCase}
                >
                  {label as string}
                </Tag>
              ))
          : "Search…"}
      </div>
      <style jsx>{`
        .autocomplete {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
          background: var(--bg-1, #14141b);
          border-radius: var(--r-sm, 6px);
          padding: 4px 8px;
          color: var(--fg-1, #b8b8c8);
          min-height: var(--input-height);
          font-size: 0.9rem;
          border: 1px solid var(--line, #2a2a38);
          min-width: 200px;
          max-width: 520px;
          cursor: text;
        }

        .autocomplete:hover {
          border-color: var(--line-strong, #3a3a4d);
        }
      `}</style>
    </>
  );
};

export default Autocomplete;
