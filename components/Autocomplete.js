import React, { useEffect, useRef, useState } from "react";
import Tag from "./Tag";

const pluralize = (length, word) => {
  return length === 1 ? word : `${word}s`;
};

const MORE_KEY = Symbol("more");

const Autocomplete = ({ options, values, setValues }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const fileteredOptions = options
    .filter((option) => !values.includes(option))
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

  const hasValues = !!values.length;
  const [firstTag, secondTag, ...tags] = values;
  const summaryValues = [
    { label: firstTag, value: firstTag },
    { label: secondTag, value: secondTag },
    {
      label:
        !!tags.length && `${tags.length} more ${pluralize(tags.length, "tag")}`,
      value: MORE_KEY,
      isLowerCase: true,
    },
  ];

  const handlerCloseTag = (valueToRemove) => (event) => {
    event.stopPropagation();

    if (valueToRemove === MORE_KEY) {
      const [firstTag, secondTag] = values;
      setValues([firstTag, secondTag]);
    } else {
      setValues(values.filter((value) => value !== valueToRemove));
    }
  };

  if (isEditable) {
    return (
      <>
        <div
          className="container"
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current.focus();
          }}
        >
          {!!values?.length &&
            summaryValues
              .filter(({ label }) => Boolean(label))
              .map(({ value, label, isLowerCase }) => (
                <Tag
                  key={label}
                  onClose={handlerCloseTag(value)}
                  isLowerCase={isLowerCase}
                >
                  {label}
                </Tag>
              ))}
          <input
            ref={inputRef}
            list="tags"
            type="text"
            autoFocus
            placeholder={!hasValues && "Search..."}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
          {!!fileteredOptions?.length && (
            <div className="options">
              {fileteredOptions.map((item) => (
                <span
                  key={item}
                  onClick={(event) => {
                    event.stopPropagation();
                    setValues([...new Set([...values, item])]);
                    setQuery("");
                    inputRef.current.focus();
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
            gap: 4px;
            height: var(--input-height);
            align-items: center;
            min-width: 200px;
            background: white;
            border: 1px solid white;
            outline: 1px auto white;
            border-radius: 4px;
            padding: 0 8px;
          }

          .container:focus-within {
            outline: 1px auto #e11d48;
          }

          .container > input {
            height: 100%;
            width: auto;
            border: none;
            padding: 0;
            font-size: 16px;
            width: ${!values?.length ? "100%" : "100px"};
            outline: none;
          }

          .options {
            background: white;
            padding: 10px 0;
            position: absolute;
            top: 32px;
            display: inline-flex;
            gap: 5px 0;
            flex-direction: column;
            width: 100%;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
              0 4px 6px -4px rgb(0 0 0 / 0.1);
            border-radius: 8px;
            color: #2d0612;
            cursor: pointer;
            z-index: 10;
          }

          .options > span {
            padding: 10px 12px;
            text-transform: capitalize;
          }

          .options > span:hover {
            background: #e11d48;
            color: white;
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
      >
        {!!values?.length
          ? summaryValues
              .filter(({ label }) => Boolean(label))
              .map(({ value, label, isLowerCase }) => (
                <Tag
                  key={label}
                  onClose={handlerCloseTag(value)}
                  isLowerCase={isLowerCase}
                >
                  {label}
                </Tag>
              ))
          : "Search..."}
      </div>
      <style jsx>{`
        .autocomplete {
          display: inline-flex;
          flex-wrap: wrap;
          gap: 4px;
          align-items: center;
          background: #fff;
          border-radius: 4px;
          padding: 0 8px;
          color: #2d0612;
          height: var(--input-height);
          font-size: 16px;
          border: 1px solid white;
          outline: 1px auto white;
          min-width: 200px;
          max-width: 500px;
          padding-right: ${!!values.length ? '108px' : "8px"}
        }
      `}</style>
    </>
  );
};

export default Autocomplete;
