import { useEffect } from "react";
import type { ReactNode } from "react";
import { Close } from "../atoms/Icons";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="head">
          <h2 className="title">{title}</h2>
          <button type="button" className="close" onClick={onClose} aria-label="Close">
            <Close size={20} />
          </button>
        </header>
        <div className="body">{children}</div>
      </div>

      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(10, 10, 15, 0.7);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .panel {
          width: 100%;
          max-width: 560px;
          max-height: calc(100vh - 32px);
          overflow-y: auto;
          background: var(--bg-1);
          border: 1px solid var(--line-strong);
          border-radius: var(--r-lg);
        }

        .head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px 0;
        }

        .title {
          margin: 0;
          font-size: 1rem;
          font-weight: 700;
          color: var(--fg-0);
        }

        .close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: var(--r-sm);
          background: transparent;
          color: var(--fg-2);
          cursor: pointer;
        }

        .close:hover {
          background: var(--bg-2);
          color: var(--fg-0);
        }

        .body {
          padding: 18px 22px 22px;
        }
      `}</style>
    </div>
  );
}
