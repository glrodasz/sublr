import { useMemo, useState } from "react";
import { PageLayout } from "../../../components/organisms/PageLayout";
import { ErrorState } from "../../../components/atoms/ErrorState";
import { DomainSummary } from "./DomainSummary";
import { DomainChart } from "./DomainChart";
import { DomainCategoryTable } from "./DomainCategoryTable";
import { PERIODS, getStartDate } from "../helpers/periods";
import { DOMAIN_CONFIG } from "../helpers/domainConfig";
import { toDomainChartData } from "../helpers/domainChartData";
import { useDomainTransactions } from "../../../hooks/useDomainTransactions";
import { useCategories } from "../../../hooks/useCategories";
import { useRecurringItems } from "../../../hooks/useRecurringItems";
import { usePaymentMethods } from "../../../hooks/usePaymentMethods";
import { useMoneyContext } from "../../../hooks/useMoneyContext";
import { startOfPreviousMonth } from "../../../utils/startOfPreviousMonth";
import { sumMonthly, computeMoM, convertedAmount } from "../../../helpers";
import type { Currency, Domain } from "../../../types";

interface Props {
  domain: Domain;
}

function NewItemButton({ label }: { label: string }) {
  return (
    <button type="button" className="new-btn" disabled>
      + {label}
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
        .new-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </button>
  );
}

/**
 * The p2/p3 mockup page, parameterized per domain: KPI header with delta and
 * run-rate, period control, area chart, category tabs and the items table.
 */
export function DomainPage({ domain }: Props) {
  const config = DOMAIN_CONFIG[domain];
  const { ctx, target } = useMoneyContext();
  const currency: Currency = target;

  const [periodIdx, setPeriodIdx] = useState(0);
  const startDate = useMemo(() => getStartDate(PERIODS[periodIdx].months), [periodIdx]);
  // Fetch at least back to the 1st of last month so the MoM badge always
  // compares against a complete previous month, whatever period is displayed.
  const fetchStart = useMemo(() => {
    const momStart = startOfPreviousMonth();
    return startDate < momStart ? startDate : momStart;
  }, [startDate]);

  const {
    transactions: fetched,
    loading: txLoading,
    error: txError,
  } = useDomainTransactions(domain, fetchStart);
  const { items: recurringItems, error: itemsError } = useRecurringItems(domain);
  const { categories, loading: catLoading, error: catError } = useCategories(domain);
  const { methods } = usePaymentMethods();
  const error = txError ?? itemsError ?? catError;

  const [activeCatId, setActiveCatId] = useState<string | null>(null);
  const selectedCatId = activeCatId ?? categories[0]?.id ?? null;

  const transactions = useMemo(
    () => fetched.filter((t) => t.occurredAt.toDate() >= startDate),
    [fetched, startDate]
  );
  const chartData = useMemo(() => toDomainChartData(transactions, ctx), [transactions, ctx]);
  const periodTotal = useMemo(
    () => transactions.reduce((sum, t) => sum + convertedAmount(t, ctx), 0),
    [transactions, ctx]
  );
  const momDelta = useMemo(() => computeMoM(fetched, { ...ctx, domain }), [fetched, ctx, domain]);
  const runRate = useMemo(() => sumMonthly(recurringItems, ctx), [recurringItems, ctx]);
  const hasForeign = useMemo(
    () => transactions.some((t) => t.currency !== currency),
    [transactions, currency]
  );

  const filteredItems = useMemo(
    () => recurringItems.filter((i) => i.categoryId === selectedCatId),
    [recurringItems, selectedCatId]
  );
  const catTotal = useMemo(() => sumMonthly(filteredItems, ctx), [filteredItems, ctx]);

  return (
    <PageLayout
      title={config.title}
      actions={<NewItemButton label={`New ${config.noun.replace(/s$/, "")}`} />}
    >
      {error && <ErrorState />}

      <DomainSummary
        domain={domain}
        periodTotal={periodTotal}
        runRate={runRate}
        currency={currency}
        deltaPct={momDelta.deltaPct}
        approximate={hasForeign}
        periodIdx={periodIdx}
        onPeriodChange={setPeriodIdx}
      />

      <DomainChart domain={domain} data={chartData} currency={currency} loading={txLoading} />

      <DomainCategoryTable
        domain={domain}
        categories={categories}
        items={filteredItems}
        paymentMethods={methods}
        selectedCategoryId={selectedCatId}
        categoryTotal={catTotal}
        currency={currency}
        loading={catLoading}
        onSelectCategory={setActiveCatId}
      />
    </PageLayout>
  );
}
