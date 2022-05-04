import React from "react";

const Filter = ({
  label,
  options,
  icon,
  showIcon,
  value,
  setValue,
  isHiddenInMobile
}) => {
  return (
    <>
      <div className={`filter ${isHiddenInMobile ? "is-hidden-in-mobile" : ""}`}>
        {showIcon ? (
          <span className="icon">
            <img src={`/icons/${icon}.svg`} />
          </span>
        ) : (
          <label>{label}</label>
        )}
        <div className="select-container">
          <select onChange={(event) => setValue(event.currentTarget.value)}>
            {options.map((option) => {
              return (
                <option
                  key={option.text}
                  value={option.value}
                  selected={option.value === value}
                >
                  {option.text}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <style jsx>{`
        .filter {
          border: none;
          display: flex;
          align-items: center;
          gap: 14px;
          color: #fecdd3;
        }

        label {
          font-weight: bold;
          text-transform: uppercase;
        }

        select {
          padding: 4px 8px;
          border-radius: 4px;
          -webkit-appearance: none;
          -moz-appearance: none;
          width: 80px;
          cursor: pointer;
          border: none;
          color: #2d0612;
        }

        .select-container {
          position: relative;
        }

        .select-container::after {
          position: absolute;
          inset: 0;
          top: 2px;
          left: auto;
          right: 5px;
          content: "▼";
          color: #2d0612;
          z-index: 10;
          pointer-events: none;
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
