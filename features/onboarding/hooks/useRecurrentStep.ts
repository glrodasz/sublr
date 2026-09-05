import { useMemo } from "react";
import { useCategories } from "../../../hooks/useCategories";
import { usePaymentMethods } from "../../../hooks/usePaymentMethods";
import { useRecurrentTransactions } from "../../../hooks/useRecurringItems";
import { useDraftRows } from "../../../hooks/useDraftRows";
import type { DraftRow } from "../../../hooks/useDraftRows";
import type { Currency, Domain, Frequency, RecurrentTransactionType } from "../../../types";

export interface RecurrentRow extends DraftRow {
  categoryId: string;
  name: string;
  amount: string;
  frequency: Frequency;
  paymentMethodId: string;
}

/** Sensible default `type` so rows aren't all recorded as OTHER. */
const DEFAULT_TYPE: Partial<Record<Domain, RecurrentTransactionType>> = {
  INCOME: "SALARY",
  SAVING: "SAVINGS_TRANSFER",
};

export function useRecurrentStep(domain: Domain, currency: Currency) {
  const { items, loading, create, remove } = useRecurrentTransactions(domain);
  const { categories } = useCategories(domain);
  const { methods } = usePaymentMethods();

  const saved = useMemo(
    () =>
      items.map((i) => ({
        id: i.id,
        categoryId: i.categoryId,
        name: i.name,
        amount: String(i.amount),
        frequency: i.frequency,
        paymentMethodId: i.paymentMethodId ?? "",
      })),
    [items]
  );

  const draft = useDraftRows<RecurrentRow>(
    () => ({
      categoryId: "",
      name: "",
      amount: "",
      frequency: "MONTHLY" as Frequency,
      paymentMethodId: "",
    }),
    { ready: !loading, rows: saved }
  );

  /** Persists rows that don't have an id yet; returns the number created. */
  const save = async () => {
    let created = 0;
    for (const row of draft.rows) {
      const amount = Number(row.amount);
      // Skip rows the user left blank or only partially filled.
      if (row.id || !row.categoryId || !row.name.trim() || !(amount > 0)) continue;

      const id = await create({
        domain,
        categoryId: row.categoryId,
        name: row.name.trim(),
        amount,
        currency,
        frequency: row.frequency,
        type: DEFAULT_TYPE[domain] ?? "OTHER",
        ...(row.paymentMethodId ? { paymentMethodId: row.paymentMethodId } : {}),
      });
      draft.update(row.key, { id });
      created++;
    }
    return created;
  };

  /**
   * Removing only from local state would leave the transaction in Firestore, so
   * it reappeared as soon as the step re-hydrated from the snapshot on the way back.
   */
  const removeAt = (key: string) => {
    const row = draft.rows.find((r) => r.key === key);
    draft.removeAt(key);
    if (row?.id) {
      remove(row.id).catch((err) => console.error("Failed to delete recurrent transaction:", err));
    }
  };

  return { ...draft, removeAt, save, categories, methods, currency };
}
