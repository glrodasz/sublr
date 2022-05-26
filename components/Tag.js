import React from "react";
import Icon from "./Icon";

const Tag = ({ children, onClose, isLowerCase }) => (
  <>
    <div className="tag">
      <span>{children}</span>
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
        background: #475569;
        padding: 2px 10px;
        border-radius: 14px;
        font-size: 14px;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
        text-transform: ${isLowerCase ? "lowercase" : "capitalize"};
        color: white;
      }
    `}</style>
  </>
);

export default Tag;
