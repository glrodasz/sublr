import React from "react";

const iconSizesMap = {
  xs: 13,
  sm: 20,
  md: 35,
  lg: 45,
};

interface Props {
  name: string;
  onClick?: React.MouseEventHandler;
  size?: "xs" | "sm" | "md" | "lg";
  children?: React.ReactNode;
}

const Icon = ({ name, onClick, size = "md" }: Props) => {
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
