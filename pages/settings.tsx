import { useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";
import auth0 from "../lib/auth0";
import { PageLayout } from "../components/organisms/PageLayout";
import { Card } from "../components/atoms/Card";
import { SectionTitle } from "../components/atoms/SectionTitle";
import { Button } from "../components/atoms/Button";
import { useUserDoc } from "../hooks/useUserDoc";

export const getServerSideProps = auth0.withPageAuthRequired();

export default function SettingsPage() {
  const { user } = useUser();
  const router = useRouter();
  const { update } = useUserDoc();
  const [busy, setBusy] = useState(false);

  const redoOnboarding = async () => {
    setBusy(true);
    try {
      // Fills in any defaults added since this account was created. Idempotent,
      // so nothing the user already has is touched or duplicated.
      const res = await fetch("/api/categories/defaults", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());

      await update({ onboardingCompleted: false });
      router.push("/onboarding/categories");
    } catch (err) {
      console.error("Failed to restart onboarding:", err);
      setBusy(false);
    }
  };

  return (
    <PageLayout title="Settings">
      <section className="grid">
        <Card>
          <SectionTitle title="Account" />
          <ul className="rows">
            <li className="row">
              <span className="label">Name</span>
              <span className="value">{user?.name ?? "—"}</span>
            </li>
            <li className="row">
              <span className="label">Email</span>
              <span className="value">{user?.email ?? "—"}</span>
            </li>
          </ul>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/api/auth/logout" className="logout">
            Log out
          </a>
        </Card>

        <Card>
          <SectionTitle title="Setup" />
          <p className="hint">
            Re-run the assisted setup to review your categories, payment methods, and recurring
            incomes and expenses.
          </p>
          <div className="redo">
            <Button variant="secondary" size="sm" onClick={redoOnboarding} disabled={busy}>
              {busy ? "Starting…" : "Redo onboarding"}
            </Button>
          </div>
        </Card>
      </section>

      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          align-items: start;
        }

        .rows {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .label {
          font-size: 0.85rem;
          color: var(--fg-2);
        }

        .value {
          font-size: 0.85rem;
          color: var(--fg-0);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .hint {
          margin: 0;
          font-size: 0.85rem;
          color: var(--fg-1);
        }

        .redo {
          margin-top: 4px;
        }

        .logout {
          margin-top: 4px;
          align-self: flex-start;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-hot);
          text-decoration: none;
        }

        .logout:hover {
          text-decoration: underline;
        }
      `}</style>
    </PageLayout>
  );
}
