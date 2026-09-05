import dynamic from "next/dynamic";
import { formatAmount } from "../../../components/atoms/Amount";
import { DOMAIN_CONFIG } from "../helpers/domainConfig";
import type { DomainChartPoint } from "../helpers/domainChartData";
import type { Currency, Domain } from "../../../types";

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
  domain: Domain;
  data: DomainChartPoint[];
  currency: Currency;
  loading: boolean;
}

/** Single-series area chart in the domain's accent, tooltip = amount, date, source. */
export function DomainChart({ domain, data, currency, loading }: Props) {
  const accent = DOMAIN_CONFIG[domain].accent;
  const gradientId = `domainGrad-${domain}`;

  return (
    <div className="chart-area">
      {!loading && data.length === 0 ? (
        <p className="empty">No transactions in this period</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={accent} stopOpacity={0.18} />
                <stop offset="95%" stopColor={accent} stopOpacity={0} />
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
              tickFormatter={(v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(0)},000` : `$${v}`)}
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
              labelStyle={{ display: "none" }}
              formatter={(v, _name, entry) => {
                const amt = typeof v === "number" ? formatAmount(v, currency) : String(v);
                const { label, name } =
                  (entry as { payload?: { label?: string; name?: string } }).payload ?? {};
                return [`${amt}`, `${label ?? ""}${name ? `, ${name}` : ""}`];
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke={accent}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{
                r: 5,
                fill: accent,
                stroke: "var(--bg-1)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      <style jsx>{`
        .chart-area {
          padding: 8px 0;
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
