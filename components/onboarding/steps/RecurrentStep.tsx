import { useMemo } from "react";
import { useCategories } from "../../../hooks/useCategories";
import { usePaymentMethods } from "../../../hooks/usePaymentMethods";
import { useRecurrentTransactions } from "../../../hooks/useRecurringItems";
import { useDraftRows } from "../../../hooks/useDraftRows";
import type { DraftRow } from "../../../hooks/useDraftRows";
import { Select } from "../../atoms/Select";
import { TextField } from "../../atoms/TextField";
import { Chip } from "../../atoms/Chip";
import { Close } from "../../atoms/Icons";
import { CURRENCY_SYMBOL, FREQUENCY_LABELS } from "../../../constants";
import type { Currency, Domain, Frequency, RecurrentTransactionType } from "../../../types";

export interface RecurrentRow extends DraftRow {
  categoryId: string;
  name: string;
  amount: string;
  frequency: Frequency;
  paymentMethodId: string;
}

const FREQUENCY_OPTIONS = (Object.keys(FREQUENCY_LABELS) as Frequency[]).map((f) => ({
  value: f,
  label: FREQUENCY_LABELS[f],
}));

/** Sensible default `type` so rows aren't all recorded as OTHER. */
const DEFAULT_TYPE: Partial<Record<Domain, RecurrentTransactionType>> = {
  INCOME: "SALARY",
  SAVING: "SAVINGS_TRANSFER",
};

export function useRecurrentStep(domain: Domain, currency: Currency) {
  const { items, loading, create } = useRecurrentTransactions(domain);
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

  return { ...draft, save, categories, methods, currency };
}

interface Props {
  state: ReturnType<typeof useRecurrentStep>;
  showPaymentMethod?: boolean;
}

export function RecurrentStep({ state, showPaymentMethod = false }: Props) {
  const { rows, add, update, removeAt, categories, methods, currency } = state;

  const categoryOptions = categories
    .filter((c) => !c.parentId)
    .map((c) => ({ value: c.id!, label: c.name }));

  const methodOptions = methods.map((m) => ({
    value: m.id!,
    label: m.alias ? `${m.name} — ${m.alias}` : m.name,
  }));

  return (
    <div className="rows">
      {rows.map((row, i) => (
        <div key={row.key} className={`row${i > 0 ? " row--divided" : ""}`}>
          <div className="category">
            <Select
              placeholder="Main category"
              options={categoryOptions}
              value={row.categoryId}
              disabled={Boolean(row.id)}
              aria-label="Main category"
              onValueChange={(value) => update(row.key, { categoryId: value })}
            />
          </div>

          <div className="line">
            <div className={`fields${showPaymentMethod ? " fields--with-method" : ""}`}>
              <TextField
                placeholder="Name"
                value={row.name}
                disabled={Boolean(row.id)}
                aria-label="Name"
                onValueChange={(value) => update(row.key, { name: value })}
              />
              <TextField
                placeholder="0"
                inputMode="decimal"
                prefix={CURRENCY_SYMBOL[currency]}
                align="right"
                value={row.amount}
                disabled={Boolean(row.id)}
                aria-label="Amount"
                onValueChange={(value) => update(row.key, { amount: value.replace(/[^\d.]/g, "") })}
              />
              <Select
                options={FREQUENCY_OPTIONS}
                value={row.frequency}
                disabled={Boolean(row.id)}
                aria-label="Frequency"
                onValueChange={(value) => update(row.key, { frequency: value as Frequency })}
              />
              {showPaymentMethod && (
                <Select
                  placeholder="Card"
                  options={methodOptions}
                  value={row.paymentMethodId}
                  disabled={Boolean(row.id)}
                  aria-label="Payment method"
                  onValueChange={(value) => update(row.key, { paymentMethodId: value })}
                />
              )}
            </div>

            {rows.length > 1 && (
              <button
                type="button"
                className="remove"
                onClick={() => removeAt(row.key)}
                aria-label={`Remove ${row.name || "row"}`}
              >
                <Close size={20} />
              </button>
            )}
          </div>
        </div>
      ))}

      <div>
        <Chip variant="add" onClick={add}>
          Add more
        </Chip>
      </div>

      <style jsx>{`
        .rows {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .row {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .row--divided {
          border-top: 1px solid var(--line);
          padding-top: 20px;
        }

        .category {
          max-width: 240px;
        }

        .line {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .fields {
          flex: 1;
          min-width: 0;
          display: grid;
          grid-template-columns: 2fr 1.4fr 1.4fr;
          gap: 12px;
        }

        .fields--with-method {
          grid-template-columns: 2fr 1.2fr 1.2fr 1.2fr;
        }

        .remove {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          padding: 0;
          border: none;
          border-radius: var(--r-md);
          background: transparent;
          color: var(--fg-2);
          cursor: pointer;
        }

        .remove:hover {
          color: var(--accent-hot);
          background: var(--bg-2);
        }

        .remove:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }

        @media (max-width: 767px) {
          .category {
            max-width: none;
          }

          .fields,
          .fields--with-method {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
