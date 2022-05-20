import React from "react";

const Icon = ({ name, onClick, size = "md" }) => {
  return (
    <>
      <span className="icon" onClick={onClick}>
        <img src={`/icons/${name}.svg`} />
      </span>
      <style jsx>{`
        .icon {
          width: ${size === "md" ? 35 : 13}px;
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