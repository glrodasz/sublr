interface Props {
  title?: string;
  description?: string;
}

/**
 * Distinct from EmptyState on purpose: a broken rule or a building index must
 * read as "something failed", never as "No data yet".
 */
export function ErrorState({
  title = "Couldn't load this data",
  description = "Something went wrong on our side. Try reloading the page.",
}: Props) {
  return (
    <div className="error-state" role="alert">
      <span className="icon" aria-hidden="true">
        ⚠
      </span>
      <span className="title">{title}</span>
      <span className="desc">{description}</span>
      <style jsx>{`
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-align: center;
          padding: 32px 24px;
          border: 1px solid var(--accent-hot);
          border-radius: var(--r-md);
          background: rgba(255, 61, 104, 0.08);
        }

        .icon {
          font-size: 1.2rem;
          color: var(--accent-hot);
        }

        .title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--fg-0);
        }

        .desc {
          font-size: 0.85rem;
          color: var(--fg-2);
          max-width: 360px;
        }
      `}</style>
    </div>
  );
}
