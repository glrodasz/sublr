import { useUser } from "@auth0/nextjs-auth0/client";
import auth0 from "../lib/auth0";
import { PageLayout } from "../components/organisms/PageLayout";
import { Card } from "../components/atoms/Card";
import { SectionTitle } from "../components/atoms/SectionTitle";

export const getServerSideProps = auth0.withPageAuthRequired();

export default function SettingsPage() {
  const { user } = useUser();

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
