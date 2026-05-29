import Link from "next/link";

interface Props {
  title: string;
  href?: string;
}

export function SectionTitle({ title, href }: Props) {
  return (
    <div className="header">
      <span className="title">{title}</span>
      {href && (
        <Link href={href} className="link">
          View all
        </Link>
      )}
      <style jsx>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--fg-0);
        }

        .link {
          font-size: 0.78rem;
          color: var(--fg-2);
          text-decoration: none;
          transition: color 0.15s;
        }

        .link:hover {
          color: var(--fg-1);
        }
      `}</style>
    </div>
  );
}
