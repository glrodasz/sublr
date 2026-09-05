import Link from "next/link";
import { useRouter } from "next/router";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "Incomes", href: "/incomes" },
  { label: "Expenses", href: "/expenses" },
  { label: "Investments", href: "/investments" },
  { label: "Savings", href: "/savings" },
  { label: "Methods", href: "/methods" },
  { label: "Settings", href: "/settings" },
];

// Icon paths only — SVGs are rendered inline so styled-jsx doesn't need to scope them
const BOTTOM_NAV = [
  { label: "Home", href: "/" },
  { label: "Incomes", href: "/incomes" },
  { label: "Expenses", href: "/expenses" },
  { label: "Invest", href: "/investments" },
  { label: "Settings", href: "/settings" },
];

function NavIcon({ href }: { href: string }) {
  if (href === "/")
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  if (href === "/incomes")
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    );
  if (href === "/expenses")
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" />
        <polyline points="19 12 12 19 5 12" />
      </svg>
    );
  if (href === "/investments")
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    );
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function Sidebar() {
  const { pathname } = useRouter();

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────── */}
      <aside className="waletto-sidebar">
        <div className="logo">Waletto</div>
        <nav className="nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? "nav-item--active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ── Mobile bottom nav ────────────────────────── */}
      {/*
       * All structural styles use the `style` prop directly.
       * styled-jsx doesn't reliably scope flex layout onto Link-rendered <a> tags,
       * so inline styles are used for layout; global CSS handles show/hide only.
       */}
      <nav
        className="waletto-bnav"
        aria-label="Main navigation"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          display: "flex",
          alignItems: "stretch",
          background: "var(--bg-1, #14141b)",
          borderTop: "1px solid var(--line, #2a2a38)",
          zIndex: 200,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {BOTTOM_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                color: active ? "var(--accent, #7cffb2)" : "var(--fg-2, #7a7a9a)",
                textDecoration: "none",
                padding: "8px 4px 4px",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <NavIcon href={item.href} />
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop sidebar: styled-jsx (works fine for non-Link elements) */}
      <style jsx>{`
        .waletto-sidebar {
          width: 220px;
          flex-shrink: 0;
          background: var(--bg-1, #14141b);
          border-right: 1px solid var(--line, #2a2a38);
          display: flex;
          flex-direction: column;
          gap: 32px;
          padding: 28px 16px;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
        }

        .logo {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--fg-0, #f0f0f5);
          padding: 0 8px;
          letter-spacing: -0.02em;
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-item {
          display: block;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.875rem;
          color: var(--fg-1, #b8b8c8);
          text-decoration: none;
          transition: background 0.1s, color 0.1s;
        }

        .nav-item:hover {
          background: var(--bg-2, #1e1e2e);
          color: var(--fg-0, #f0f0f5);
        }

        .nav-item--active {
          background: var(--bg-2, #1e1e2e);
          color: var(--fg-0, #f0f0f5);
          font-weight: 600;
        }
      `}</style>

      {/* Global CSS for show/hide only — avoids styled-jsx scoping issues */}
      <style jsx global>{`
        .waletto-bnav {
          display: none !important;
        }

        @media (max-width: 767px) {
          .waletto-sidebar {
            display: none !important;
          }

          .waletto-bnav {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
