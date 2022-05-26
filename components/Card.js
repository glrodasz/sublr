import React from "react";

const Card = ({
  children,
  height,
  isInline,
  side,
  onClick,
  backsideContent,
}) => {
  return (
    <>
      <div
        onClick={onClick}
        className={`card ${backsideContent ? "flipping" : ""} ${
          side ? side : ""
        }${isInline ? "is-inline" : ""}`}
      >
        <div className={`frontside-content`}>{children}</div>
        {backsideContent && (
          <div className="backside-content">{backsideContent}</div>
        )}
      </div>
      <style jsx>{`
        .card {
          position: relative;
          height: ${height ? `${height}px` : "auto"};
        }

        .card.backside > .frontside-content {
          transform: rotateY(180deg);
        }

        .card.backside > .backside-content {
          transform: rotateY(0deg);
        }

        .frontside-content,
        .backside-content {
          border: 1px solid rgba(0, 0, 0, 0.01);
          border-radius: 8px;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
            0 4px 6px -4px rgb(0 0 0 / 0.1);
          width: 100%;
          display: flex;
          flex-direction: column;
          background: #fff;
          perspective: 1000px;
          transition: all 0.5s;
          backface-visibility: hidden;
          height: ${height ? `${height}px` : "initial"};
        }

        .flipping > .frontside-content,
        .backside-content {
          position: absolute;
        }

        .frontside-content {
          transform: rotateY(0deg);
        }

        .backside-content {
          transform: rotateY(180deg);
        }
      `}</style>
    </>
  );
};

export default Card;
