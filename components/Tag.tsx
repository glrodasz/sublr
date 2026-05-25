import React from "react";
import Icon from "./Icon";
import { getTagStyle } from "../lib/tagStyles";

interface Props {
  children: string;
  onClose?: React.MouseEventHandler;
  isLowerCase?: boolean;
  truncate?: number;
}

const Tag = ({ children, onClose, isLowerCase, truncate }: Props) => {
  const { color } = getTagStyle(children);
  const display =
    truncate && children.length > truncate ? `${children.slice(0, truncate)}…` : children;

  return (
    <>
      <div className="tag" style={{ borderColor: color, color }}>
        <span title={children}>{display}</span>
        {onClose && (
          <Icon name="cross" onClick={onClose} size="xs">
            X
          </Icon>
        )}
      </div>
      <style jsx>{`
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: 1px solid;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: ${isLowerCase ? "lowercase" : "capitalize"};
        }
      `}</style>
    </>
  );
};

export default Tag;
