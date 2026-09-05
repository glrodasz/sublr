import type { Currency, Domain } from "../../types";
import { useRecurringItems } from "../../hooks/useRecurringItems";
import { useCategories } from "../../hooks/useCategories";
import { useUserDoc } from "../../hooks/useUserDoc";
import { sumMonthly } from "../../helpers/aggregations";
import { StatCard } from "../molecules/StatCard";
import { TransactionRow } from "../molecules/TransactionRow";
import { Card } from "../atoms/Card";
import { SectionTitle } from "../atoms/SectionTitle";

interface Props {
  domain: Domain;
  monthlyLabel: string;
}

const FREQ_LABEL: Record<string, string> = {
  ONE_TIME: "One-time",
  WEEKLY: "Weekly",
  BIWEEKLY: "Biweekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
};

export function DomainView({ domain, monthlyLabel }: Props) {
  const { items, loading } = useRecurringItems(domain);
  const { categories } = useCategories(domain);
  const userDoc = useUserDoc();

  const currency: Currency = userDoc?.mainCurrency ?? "USD";
  const monthlyTotal = sumMonthly(items);

  // Group items by category, preserving category order
  const grouped = categories
    .map((cat) => ({
      id: cat.id ?? "",
      name: cat.name,
      items: items.filter((i) => i.categoryId === cat.id),
    }))
    .filter((g) => g.items.length > 0);

  // Items whose category was archived/removed
  const orphans = items.filter((i) => !categories.some((c) => c.id === i.categoryId));
  if (orphans.length > 0) {
    grouped.push({ id: "__other", name: "Other", items: orphans });
  }

  return (
    <>
      <section className="row">
        <StatCard
          title={monthlyLabel}
          amount={monthlyTotal}
          currency={currency}
          domain={domain}
        />
      </section>

      <section className="groups">
        {loading ? (
          <Card>
            <p className="empty">Loading…</p>
          </Card>
        ) : grouped.length === 0 ? (
          <Card>
            <p className="empty">No items yet</p>
          </Card>
        ) : (
          grouped.map((group) => (
            <Card key={group.id}>
              <SectionTitle title={group.name} />
              <ul className="list">
                {group.items.map((item) => (
                  <TransactionRow
                    key={item.id}
                    name={item.name}
                    amount={item.amount}
                    currency={item.currency}
                    meta={FREQ_LABEL[item.frequency] ?? item.frequency}
                  />
                ))}
              </ul>
            </Card>
          ))
        )}
      </section>

      <style jsx>{`
        .row {
          display: flex;
          gap: 16px;
        }

        .groups {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          align-items: start;
        }

        .list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .empty {
          margin: 0;
          font-size: 0.85rem;
          color: var(--fg-2);
        }

        @media (max-width: 600px) {
          .groups {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
