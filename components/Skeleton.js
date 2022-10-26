import css from "styled-jsx/css";

// POSSIBLE FEAT: REMOVE OR CHANGE ANIMATION BASED ON USER'S "prefers-reduced-motion" VALUE
const skeletonStyles = css.global`
  .skeleton {
    background: #d9d9d9;
    position: relative;
    overflow: hidden;
  }

  .skeleton::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    transform: translateX(-100%);
    background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.15) 20%,
      rgba(255, 255, 255, 0.2) 60%,
      rgba(255, 255, 255, 0)
    );
    animation: shimmer 1s infinite;
  }

  .skeleton.dark {
    background: #5a5a5a;
  }

  .skeleton.dark::after {
    background-image: linear-gradient(
      to right,
      rgba(60, 60, 60, 0) 0%,
      rgba(60, 60, 60, 0.15) 20%,
      rgba(60, 60, 60, 0.2) 60%,
      rgba(60, 60, 60, 0)
    );
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
`;

const Box = ({ width, height, dark = false }) => {
  return (
    <>
      <div
        className={dark ? "skeleton box dark" : "skeleton box"}
        style={{ width, height }}
      ></div>
      <style jsx global>
        {skeletonStyles}
      </style>
    </>
  );
};

const Circle = ({ diameter, dark = false }) => {
  return (
    <>
      <div
        className={dark ? "skeleton circle dark" : "skeleton circle"}
        style={{ height: diameter, width: diameter }}
      ></div>
      <style jsx>{`
        .circle {
          border-radius: 50%;
          height: 100%;
          width: 100%;
        }
      `}</style>
      <style jsx global>
        {skeletonStyles}
      </style>
    </>
  );
};

const Text = ({
  lineHeight,
  lineWidth = "100%",
  numberOfLines = 1,
  lineSpacing = 8,
  dark = false,
}) => {
  return (
    <>
      <div className="text" style={{ gap: lineSpacing, width: lineWidth }}>
        {new Array(numberOfLines).fill(null).map((_, idx) => (
          <Box key={idx} height={lineHeight} width={lineWidth} dark={dark} />
        ))}
      </div>
      <style jsx>{`
        .text {
          display: flex;
          flex-direction: column;
        }
      `}</style>
      <style jsx global>
        {skeletonStyles}
      </style>
    </>
  );
};

const Skeleton = {
  Box,
  Circle,
  Text,
};

export default Skeleton;
