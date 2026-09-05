import type { SVGProps } from "react";

type IconProps = { size?: number } & Omit<SVGProps<SVGSVGElement>, "width" | "height">;

// Feather-style stroke icons matching the inline SVGs already used in Sidebar.
function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

export function ArrowLeft({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export function ArrowRight({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function Plus({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function Close({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function ChevronDown({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function TrendingUp({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export function TrendingDown({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

export function Briefcase({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

export function Lifebuoy({ size = 20, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
      <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
      <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
      <line x1="9.17" y1="14.83" x2="4.93" y2="19.07" />
    </svg>
  );
}
