import React from "react";

const Tag = ({ children }) => (
  <>
    <span className="tag">{children}</span>
    <style jsx>{`
      .tag {
        background: #475569;
        padding: 2px 10px;
        border-radius: 14px;
        font-size: 14px;
        text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
        text-transform: capitalize;
      }
    `}</style>
  </>
);

export default Tag;
