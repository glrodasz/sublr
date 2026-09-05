import type { ReactNode } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ArrowLeft } from "../../../components/atoms/Icons";

export const ONBOARDING_STEPS = [
  { label: "Categories", href: "/onboarding/categories" },
  { label: "Input methods", href: "/onboarding/methods" },
  { label: "Incomes", href: "/onboarding/incomes" },
  { label: "Expenses", href: "/onboarding/expenses" },
] as const;

interface Props {
  /** 1-based index into ONBOARDING_STEPS. */
  step: number;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onBack?: () => void;
}

export function OnboardingLayout({ step, description, children, footer, onBack }: Props) {
  const router = useRouter();
  const progress = (step / ONBOARDING_STEPS.length) * 100;

  const handleBack = () => {
    if (onBack) return onBack();
    const previous = ONBOARDING_STEPS[step - 2];
    router.push(previous ? previous.href : "/");
  };

  return (
    <>
      <Head>
        <title>Assisted setup — Waletto</title>
        <meta name="theme-color" content="#0A0A0F" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="layout">
        <div className="shell">
          <header className="header">
            <button type="button" className="back" onClick={handleBack} aria-label="Go back">
              <ArrowLeft size={22} />
            </button>
            <h1 className="title">Assisted setup</h1>
          </header>

          <nav className="stepper" aria-label="Setup progress">
            <ol className="tabs">
              {ONBOARDING_STEPS.map((s, i) => {
                const n = i + 1;
                const state = n === step ? "current" : n < step ? "done" : "todo";
                return (
                  <li key={s.href} className={`tab tab--${state}`}>
                    <span aria-current={n === step ? "step" : undefined}>
                      {n}. {s.label}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className="track">
              <div className="fill" style={{ width: `${progress}%` }} />
            </div>
          </nav>

          {description && <p className="description">{description}</p>}

          <div className="body">{children}</div>

          {footer && <div className="footer">{footer}</div>}
        </div>
      </div>

      <style jsx>{`
        .layout {
          min-height: 100vh;
          background: var(--bg-0);
          display: flex;
          justify-content: center;
          padding: 48px 24px 64px;
        }

        .shell {
          width: 100%;
          max-width: 860px;
          display: flex;
          flex-direction: column;
        }

        .header {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
        }

        .back {
          position: absolute;
          left: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          padding: 0;
          border: none;
          border-radius: var(--r-md);
          background: transparent;
          color: var(--fg-0);
          cursor: pointer;
        }

        .back:hover {
          background: var(--bg-2);
        }

        .back:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        .title {
          margin: 0;
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--fg-0);
        }

        .stepper {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .tabs {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .tab {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--fg-2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .tab--current {
          color: var(--fg-0);
        }

        .tab--done {
          color: var(--fg-1);
        }

        .track {
          height: 3px;
          border-radius: 999px;
          background: var(--line);
          overflow: hidden;
        }

        .fill {
          height: 100%;
          border-radius: 999px;
          background: var(--accent);
          transition: width 240ms ease;
        }

        .description {
          margin: 28px 0 0;
          font-size: 0.9375rem;
          color: var(--fg-1);
        }

        .body {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .footer {
          margin-top: 48px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        @media (max-width: 767px) {
          .layout {
            /* Extra bottom padding reserves room for the fixed footer bar below,
               so the last bit of content never sits underneath it. */
            padding: 24px 16px calc(96px + env(safe-area-inset-bottom, 0px));
          }

          .header {
            margin-bottom: 28px;
          }

          .title {
            font-size: 1.125rem;
          }

          .tabs {
            gap: 4px;
          }

          .tab {
            font-size: 0.75rem;
          }

          .footer {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 200;
            margin-top: 0;
            padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
            background: var(--bg-1);
            border-top: 1px solid var(--line);
          }
        }
      `}</style>
    </>
  );
}
