import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import auth0 from "../lib/auth0";
import { PageLayout } from "../components/organisms/PageLayout";
import { Card } from "../components/atoms/Card";
import { Amount, formatAmount } from "../components/atoms/Amount";
import { useCategories } from "../hooks/useCategories";
import { useRecurringItems } from "../hooks/useRecurringItems";
import { useDomainTransactions } from "../hooks/useDomainTransactions";
import { useUserDoc } from "../hooks/useUserDoc";
import { sumMonthly, computeMoM } from "../helpers";
import type { Currency } from "../types";

const AreaChart = dynamic(() => import("recharts").then((m) => m.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then((m) => m.Area), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });

export const getServerSideProps = auth0.withPageAuthRequired();

const PERIODS = [
  { label: "Current", months: 0 },
  { label: "1M", months: 1 },
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "1Y", months: 12 },
] as const;

function getStartDate(months: number): Date {
  const now = new Date();
  if (months === 0) return new Date(now.getFullYear(), now.getMonth(), 1);
  const d = new Date(now);
  d.setMonth(d.getMonth() - months);
  return d;
}

function toChartData(transactions: { occurredAt: unknown; amount: number; name: string }[]) {
  return transactions.map((t) => {
    const ts = t.occurredAt as { toDate?: () => Date };
    const date = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts as unknown as string);
    return {
      label: new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date),
      amount: t.amount,
      name: t.name,
    };
  });
}

function freqLabel(f: string) {
  return f.charAt(0) + f.slice(1).toLowerCase().replace(/_/g, "-");
}

export default function ExpensesPage() {
  const userDoc = useUserDoc();
  const currency: Currency = userDoc?.mainCurrency ?? "USD";

  const [periodIdx, setPeriodIdx] = useState(0);
  const startDate = useMemo(() => getStartDate(PERIODS[periodIdx].months), [periodIdx]);

  const { transactions, loading: txLoading } = useDomainTransactions("EXPENSE", startDate);
  const { items: recurringItems, loading: riLoading } = useRecurringItems("EXPENSE");
  const { categories, loading: catLoading } = useCategories("EXPENSE");

  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const selectedCatId = activeCatId ?? categories[0]?.id ?? null;
  const selectedCat = categories.find((c) => c.id === selectedCatId);

  const chartData = useMemo(() => toChartData(transactions), [transactions]);
  const momDelta = useMemo(() => computeMoM(transactions), [transactions]);
  const hasDelta = momDelta.deltaPct !== 0;
  const deltaUp = momDelta.deltaPct > 0;

  const monthlyTotal = useMemo(() => sumMonthly(recurringItems), [recurringItems]);

  const filteredItems = useMemo(
    () => recurringItems.filter((i) => i.categoryId === selectedCatId),
    [recurringItems, selectedCatId]
  );
  const catTotal = useMemo(() => sumMonthly(filteredItems), [filteredItems]);

  const newExpenseBtn = (
    <button type="button" className="new-btn" disabled>
      + New expense
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
      </svg>
      <style jsx>{`
        .new-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--r-md);
          border: none;
          background: var(--fg-0);
          color: var(--bg-0);
          font-family: inherit;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
        }
        .new-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </button>
  );

  return (
    <PageLayout title="Expenses" actions={newExpenseBtn}>
      {/* Summary + period tabs */}
      <div className="summary-row">
        <div>
          <span className="summary-label">Total expenses</span>
          <div className="summary-amount">
            <Amount value={monthlyTotal} currency={currency} size="lg" />
            {hasDelta && (
              <span className={`delta-badge ${deltaUp ? "up" : "down"}`}>
                {deltaUp ? "▲" : "▼"} {Math.abs(momDelta.deltaPct).toFixed(0)}%
              </span>
            )}
          </div>
        </div>
        <div className="period-tabs">
          {PERIODS.map((p, i) => (
            <button
              key={p.label}
              className={`period-btn${i === periodIdx ? " active" : ""}`}
              onClick={() => setPeriodIdx(i)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart — no Card wrapper, sits on page background */}
      <div className="chart-area">
        {!txLoading && chartData.length === 0 ? (
          <p className="empty">No transactions in this period</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-hot)" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="var(--accent-hot)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--line)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "var(--fg-2)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "var(--fg-2)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `$${(v / 1000).toFixed(0)},000` : `$${v}`
                }
                width={68}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--bg-1)",
                  border: "1px solid var(--line-strong)",
                  borderRadius: 10,
                  fontSize: 13,
                  padding: "10px 14px",
                }}
                labelStyle={{ display: "none" }}
                formatter={(v, _name, entry) => {
                  const amt = typeof v === "number" ? formatAmount(v, currency) : String(v);
                  const { label, name } = (entry as { payload?: { label?: string; name?: string } }).payload ?? {};
                  return [`${amt}`, `${label ?? ""}${name ? `, ${name}` : ""}`];
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--accent-hot)"
                strokeWidth={2}
                fill="url(#expGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "var(--accent-hot)", stroke: "var(--bg-1)", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Categories */}
      <Card>
        <div className="cat-header">
          <span className="cat-title">Categories</span>
          <button type="button" className="filter-btn" disabled aria-label="Filter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
            </svg>
          </button>
        </div>

        {catLoading ? (
          <p className="empty">Loading…</p>
        ) : categories.length === 0 ? (
          <p className="empty">No categories yet</p>
        ) : (
          <>
            <div className="cat-tabs">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`cat-tab${cat.id === selectedCatId ? " active" : ""}`}
                  onClick={() => setActiveCatId(cat.id ?? null)}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {selectedCat && (
              <p className="cat-total">
                Expenses by {selectedCat.name}:{" "}
                <strong>{formatAmount(catTotal, currency)}</strong>
              </p>
            )}

            {filteredItems.length === 0 ? (
              <p className="empty">No items in this category</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Frequency</th>
                    <th>Payment method</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td className="mono">{formatAmount(item.amount, item.currency)}</td>
                      <td className="muted">{freqLabel(item.frequency)}</td>
                      <td className="muted">—</td>
                      <td className="actions">
                        <button type="button" className="more-btn" disabled aria-label="More options">⋮</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </Card>

      <style jsx>{`
        .summary-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .summary-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--fg-2);
          margin-bottom: 6px;
        }

        .summary-amount {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .delta-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 999px;
        }

        .delta-badge.up {
          background: rgba(124, 255, 178, 0.12);
          color: var(--accent);
        }

        .delta-badge.down {
          background: rgba(255, 61, 104, 0.12);
          color: var(--accent-hot);
        }

        .period-tabs {
          display: flex;
          gap: 2px;
          background: var(--bg-2);
          border-radius: var(--r-sm);
          padding: 3px;
          align-self: flex-start;
        }

        .period-btn {
          padding: 5px 12px;
          border-radius: calc(var(--r-sm) - 2px);
          border: none;
          background: transparent;
          color: var(--fg-2);
          font-size: 0.8rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }

        .period-btn.active {
          background: var(--bg-3);
          color: var(--fg-0);
        }

        .chart-area {
          padding: 8px 0;
        }

        .cat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cat-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--fg-0);
        }

        .filter-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: var(--fg-2);
          cursor: pointer;
          border-radius: var(--r-sm);
          transition: background 0.15s, color 0.15s;
        }

        .filter-btn:hover:not(:disabled) {
          background: var(--bg-2);
          color: var(--fg-1);
        }

        .filter-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .cat-tabs {
          display: flex;
          border-bottom: 1px solid var(--line);
          margin-bottom: 16px;
          gap: 0;
        }

        .cat-tab {
          padding: 8px 16px 9px;
          border: none;
          background: transparent;
          color: var(--fg-2);
          font-size: 0.85rem;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: color 0.15s, border-color 0.15s;
          white-space: nowrap;
        }

        .cat-tab.active {
          color: var(--fg-0);
          border-bottom-color: var(--domain-expense);
        }

        .cat-tab:first-child {
          padding-left: 0;
        }

        .cat-total {
          margin: 0 0 16px;
          font-size: 0.85rem;
          color: var(--fg-2);
        }

        .cat-total strong {
          color: var(--fg-0);
          font-family: var(--font-mono);
          font-variant-numeric: tabular-nums;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .table th {
          text-align: left;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--fg-2);
          padding: 0 12px 10px 0;
          border-bottom: 1px solid var(--line);
          white-space: nowrap;
        }

        .table th:last-child { padding-right: 0; }

        .table td {
          padding: 12px 12px 12px 0;
          color: var(--fg-1);
          border-bottom: 1px solid var(--line);
          vertical-align: middle;
        }

        .table td:last-child { padding-right: 0; }

        .table tr:last-child td {
          border-bottom: none;
        }

        .mono {
          font-family: var(--font-mono, "JetBrains Mono", ui-monospace, monospace);
          font-variant-numeric: tabular-nums;
          color: var(--fg-0);
          font-weight: 600;
          white-space: nowrap;
        }

        .muted {
          color: var(--fg-2);
        }

        .actions {
          text-align: right;
          width: 32px;
        }

        .more-btn {
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: var(--fg-2);
          font-size: 1.1rem;
          cursor: pointer;
          border-radius: var(--r-sm);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s;
        }

        .more-btn:hover:not(:disabled) {
          background: var(--bg-2);
          color: var(--fg-1);
        }

        .more-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .empty {
          margin: 0;
          font-size: 0.85rem;
          color: var(--fg-2);
        }

        @media (max-width: 600px) {
          .table th:nth-child(4),
          .table td:nth-child(4) {
            display: none;
          }
        }
      `}</style>
    </PageLayout>
  );
}
