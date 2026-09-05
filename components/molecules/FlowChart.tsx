import dynamic from "next/dynamic";
import { formatAmount } from "../atoms/Amount";
import type { FlowPoint } from "../../helpers/chartData";
import type { Currency } from "../../types";

// recharts is client-only and heavy, so every piece is loaded on demand.
const AreaChart = dynamic(() => import("recharts").then((m) => m.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then((m) => m.Area), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid), {
  ssr: false,
});
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), {
  ssr: false,
});

interface Props {
  data: FlowPoint[];
  currency: Currency;
  loading: boolean;
  height?: number;
}

/** Income vs expense over time — the two-series area chart from the mockup. */
export function FlowChart({ data, currency, loading, height = 240 }: Props) {
  const hasMoney = data.some((p) => p.income !== 0 || p.expense !== 0);

  return (
    <div className="chart-area">
      {!loading && !hasMoney ? (
        <p className="empty">No transactions in this period</p>
      ) : (
        <>
          <div className="legend">
            <span className="key income">Income</span>
            <span className="key expense">Expenses</span>
          </div>
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="flowIncomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--domain-income)" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="var(--domain-income)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="flowExpenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--domain-expense)" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="var(--domain-expense)" stopOpacity={0} />
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
                cursor={{ stroke: "var(--line-strong)", strokeDasharray: "4 4" }}
                contentStyle={{
                  background: "var(--bg-1)",
                  border: "1px solid var(--line-strong)",
                  borderRadius: 10,
                  fontSize: 13,
                  padding: "10px 14px",
                }}
                labelStyle={{ color: "var(--fg-2)", marginBottom: 4 }}
                formatter={(v, name) => [
                  typeof v === "number" ? formatAmount(v, currency) : String(v),
                  name === "income" ? "Income" : "Expenses",
                ]}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="var(--domain-income)"
                strokeWidth={2}
                fill="url(#flowIncomeGrad)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "var(--domain-income)",
                  stroke: "var(--bg-1)",
                  strokeWidth: 2,
                }}
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="var(--domain-expense)"
                strokeWidth={2}
                fill="url(#flowExpenseGrad)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "var(--domain-expense)",
                  stroke: "var(--bg-1)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      )}

      <style jsx>{`
        .chart-area {
          padding: 8px 0;
        }

        .legend {
          display: flex;
          gap: 14px;
          margin-bottom: 4px;
        }

        .key {
          font-size: 0.75rem;
          color: var(--fg-2);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .key::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .key.income::before {
          background: var(--domain-income);
        }

        .key.expense::before {
          background: var(--domain-expense);
        }

        .empty {
          margin: 0;
          font-size: 0.85rem;
          color: var(--fg-2);
        }
      `}</style>
    </div>
  );
}
