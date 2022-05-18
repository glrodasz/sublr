import React, { useEffect, useRef, useState } from "react";
import Tag from "./Tag";

const Autocomplete = ({ options, values, setValues }) => {
  const [isEditable, setIsEditable] = useState(false);
  const fileteredOptions = options.filter((option) => !values.includes(option));

  useEffect(() => {
    const closeOptions = () => setIsEditable(false);
    window.addEventListener("click", closeOptions);
    return () => window.removeEventListener("click", closeOptions);
  }, []);

  if (isEditable) {
    return (
      <>
        <div className="container">
          {!!values?.length &&
            values.map((value) => <Tag key={value}>{value}</Tag>)}
          <input list="tags" type="text" autoFocus placeholder="Search..." />
          {!!fileteredOptions?.length && (
            <div className="options">
              {fileteredOptions.map((item) => (
                <span
                  key={item}
                  onClick={(event) => {
                    event.stopPropagation();
                    setValues([...new Set([...values, item])]);
                    setIsEditable(false);
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
            align-items: center;
            min-width: 200px;
            max-width: 400px;
            background: white;
          }

          .container > input {
            height: 28px;
            width: auto;
            border-radius: 4px;
            border: none;
            padding: 0 8px;
            font-size: 16px;
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
          ? values.map((value) => <Tag key={value}>{value}</Tag>)
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
          min-width: 180px;
          color: #2d0612;
          min-height: 28px;
          font-size: 16px;
          border: none;
          outline: 1px auto white;
          min-width: 200px;
          max-width: 400px;
        }
      `}</style>
    </>
  );
};

export default Autocomplete;
{
}
