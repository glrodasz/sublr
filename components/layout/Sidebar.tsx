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

export function Sidebar() {
  const { pathname } = useRouter();

  return (
    <aside className="sidebar">
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

      <style jsx>{`
        .sidebar {
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
    </aside>
  );
}
