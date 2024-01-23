import React from "react";
import Image from 'next/image'

const iconSizesMap = {
  "xs" : 13,
  "sm": 20,
  "md": 35,
  "lg": 45,
}

interface IconProps {
  name: string;
  onClick?: () => void;
  size?: keyof typeof iconSizesMap;
}

const Icon: React.FC<IconProps> = ({ name, onClick, size = "md" }) => {
  return (
    <>
      <span className="icon" onClick={onClick}>
        <Image
          src={`/icons/${name}.svg`}
          alt={name}
        />
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