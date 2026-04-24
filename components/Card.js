import React from "react";

const classNames = (obj) => {
  const classes = Object.entries(obj)
    .filter((entry) => Boolean(entry[1]))
    .map((entry) => entry[0]);

  return classes.join(" ");
};

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
        className={`card ${classNames({
          flipping: backsideContent,
          "is-inline": isInline,
          "is-clickable": onClick,
          [side]: side,
        })}`}
      >
        <div className="frontside-content">{children}</div>
        {backsideContent && (
          <div className="backside-content">{backsideContent}</div>
        )}
      </div>
      <style jsx>{`
        .card {
          position: relative;
          height: ${height ? `${height}px` : "auto"};
        }

        .card.flipping {
          perspective: 1000px;
        }

        .card.backside > .frontside-content {
          transform: rotateY(180deg);
        }

        .card.backside > .backside-content {
          transform: rotateY(0deg);
        }

        .frontside-content,
        .backside-content {
          border: 1px solid var(--line, #2a2a38);
          border-radius: var(--r-md, 10px);
          width: 100%;
          display: flex;
          flex-direction: column;
          background: var(--bg-1, #14141b);
          transition: transform 0.5s ease, box-shadow 0.15s ease,
            border-color 0.15s ease;
          backface-visibility: hidden;
          height: ${height ? `${height}px` : "initial"};
          box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.04);
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

        @media (hover: hover) and (pointer: fine) {
          .is-clickable:hover > .frontside-content,
          .is-clickable:hover > .backside-content {
            border-color: var(--accent, #7cffb2);
            box-shadow: 0 0 0 1px var(--glow, rgba(124, 255, 178, 0.12)),
              0 0 28px var(--glow, rgba(124, 255, 178, 0.12));
          }
        }
      `}</style>
    </>
  );
};

export default Card;
