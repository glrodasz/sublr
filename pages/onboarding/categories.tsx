import { useRouter } from "next/router";
import Head from "next/head";
import auth0 from "../../lib/auth0";
import { CategoriesStep } from "../../components/onboarding/CategoriesStep";

export const getServerSideProps = auth0.withPageAuthRequired();

const STEPS = ["Categories", "Payment methods", "Incomes & Expenses", "Done"];

export default function OnboardingCategories() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Set up categories — Waletto</title>
        <meta name="theme-color" content="#0A0A0F" />
      </Head>

      <div className="layout">
        <header className="header">
          <span className="logo">Waletto</span>
        </header>

        <main className="main">
          <nav className="progress" aria-label="Setup progress">
            {STEPS.map((step, i) => (
              <div key={step} className={`step-dot ${i === 0 ? "step-dot--active" : ""}`}>
                <span className="step-number">{i + 1}</span>
                <span className="step-label">{step}</span>
              </div>
            ))}
          </nav>

          <div className="card">
            <CategoriesStep onNext={() => router.push("/onboarding/payment-methods")} />
          </div>
        </main>
      </div>

      <style jsx>{`
        .layout {
          min-height: 100vh;
          background: var(--bg-0, #0a0a0f);
          display: flex;
          flex-direction: column;
        }

        .header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--line, #2a2a38);
        }

        .logo {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--fg-0, #f0f0f5);
          letter-spacing: -0.02em;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
          gap: 32px;
        }

        .progress {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .step-dot {
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.35;
        }

        .step-dot--active {
          opacity: 1;
        }

        .step-dot + .step-dot::before {
          content: "";
          display: block;
          width: 24px;
          height: 1px;
          background: var(--line, #2a2a38);
          margin-right: 8px;
        }

        .step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: 700;
          background: var(--bg-1, #14141b);
          border: 1px solid var(--line, #2a2a38);
          color: var(--fg-0, #f0f0f5);
        }

        .step-dot--active .step-number {
          background: var(--accent, #7cffb2);
          color: #0a0a0f;
          border-color: var(--accent, #7cffb2);
        }

        .step-label {
          font-size: 0.8rem;
          color: var(--fg-1, #b8b8c8);
          white-space: nowrap;
        }

        .card {
          width: 100%;
          max-width: 640px;
          background: var(--bg-1, #14141b);
          border: 1px solid var(--line, #2a2a38);
          border-radius: 16px;
          padding: 32px;
        }

        @media (max-width: 480px) {
          .step-label {
            display: none;
          }

          .card {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}
