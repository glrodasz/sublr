import React from "react";

const iconSizesMap = {
  "xs" : 13,
  "sm": 20,
  "md": 35
}

const Icon = ({ name, onClick, size = "md" }) => {
  return (
    <>
      <span className="icon" onClick={onClick}>
        <img src={`/icons/${name}.svg`} />
      </span>
      <style jsx>{`
        .icon {
          width: ${iconSizesMap[size]}px;
          line-height: 0;
          ${onClick && "cursor: pointer;"}
        }

        .icon img {
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default Icon;