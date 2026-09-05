import { useMemo } from "react";
import { usePaymentMethods } from "../../../hooks/usePaymentMethods";
import { useDraftRows } from "../../../hooks/useDraftRows";
import type { DraftRow } from "../../../hooks/useDraftRows";
import { Select } from "../../atoms/Select";
import { TextField } from "../../atoms/TextField";
import { Chip } from "../../atoms/Chip";
import { Close } from "../../atoms/Icons";
import type { PaymentMethodType } from "../../../types";

/** Common methods, each mapped to the schema's PaymentMethodType. */
const METHOD_OPTIONS: { name: string; type: PaymentMethodType }[] = [
  { name: "American Express", type: "CREDIT_CARD" },
  { name: "Visa", type: "CREDIT_CARD" },
  { name: "Mastercard", type: "CREDIT_CARD" },
  { name: "Credit card", type: "CREDIT_CARD" },
  { name: "Debit card", type: "DEBIT_CARD" },
  { name: "Bank transfer", type: "BANK_TRANSFER" },
  { name: "Wise", type: "DIGITAL_WALLET" },
  { name: "PayPal", type: "DIGITAL_WALLET" },
  { name: "Cash", type: "CASH" },
  { name: "Crypto wallet", type: "CRYPTO_WALLET" },
  { name: "Other", type: "OTHER" },
];

const CARD_TYPES: PaymentMethodType[] = ["CREDIT_CARD", "DEBIT_CARD"];

export interface MethodRow extends DraftRow {
  name: string;
  last4: string;
  alias: string;
}

export function useMethodsStep() {
  const { methods, loading, create } = usePaymentMethods();

  const saved = useMemo(
    () =>
      methods.map((m) => ({
        id: m.id,
        name: m.name,
        last4: m.last4 ?? "",
        alias: m.alias ?? "",
      })),
    [methods]
  );

  const draft = useDraftRows<MethodRow>(() => ({ name: "", last4: "", alias: "" }), {
    ready: !loading,
    rows: saved,
  });

  /** Persists rows that don't have an id yet; returns the number created. */
  const save = async () => {
    let created = 0;
    for (const row of draft.rows) {
      if (row.id || !row.name.trim()) continue;
      const option = METHOD_OPTIONS.find((o) => o.name === row.name);
      const id = await create({
        name: row.name.trim(),
        type: option?.type ?? "OTHER",
        ...(row.last4 && CARD_TYPES.includes(option?.type ?? "OTHER") ? { last4: row.last4 } : {}),
        ...(row.alias.trim() ? { alias: row.alias.trim() } : {}),
      });
      draft.update(row.key, { id });
      created++;
    }
    return created;
  };

  return { ...draft, save };
}

interface Props {
  state: ReturnType<typeof useMethodsStep>;
}

export function MethodsStep({ state }: Props) {
  const { rows, add, update, removeAt } = state;

  return (
    <div className="rows">
      {rows.map((row, i) => {
        const type = METHOD_OPTIONS.find((o) => o.name === row.name)?.type;
        const showLast4 = type ? CARD_TYPES.includes(type) : false;

        return (
          <div key={row.key} className={`row${i > 0 ? " row--divided" : ""}`}>
            <div className={`fields${showLast4 ? "" : " fields--narrow"}`}>
              <Select
                label="Pick the card o method name"
                placeholder="Select a method"
                options={METHOD_OPTIONS.map((o) => ({ value: o.name, label: o.name }))}
                value={row.name}
                disabled={Boolean(row.id)}
                onValueChange={(value) => update(row.key, { name: value })}
              />

              {showLast4 && (
                <TextField
                  label="Last 4 numbers"
                  placeholder="0000"
                  inputMode="numeric"
                  maxLength={4}
                  value={row.last4}
                  disabled={Boolean(row.id)}
                  onValueChange={(value) =>
                    update(row.key, { last4: value.replace(/\D/g, "").slice(0, 4) })
                  }
                />
              )}

              <TextField
                label="Alias name"
                placeholder="Ex: personal card"
                value={row.alias}
                disabled={Boolean(row.id)}
                onValueChange={(value) => update(row.key, { alias: value })}
              />
            </div>

            {rows.length > 1 && (
              <button
                type="button"
                className="remove"
                onClick={() => removeAt(row.key)}
                aria-label={`Remove ${row.name || "payment method"}`}
              >
                <Close size={20} />
              </button>
            )}
          </div>
        );
      })}

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
          align-items: flex-end;
          gap: 12px;
        }

        .row--divided {
          border-top: 1px solid var(--line);
          padding-top: 20px;
        }

        .fields {
          flex: 1;
          min-width: 0;
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr;
          gap: 12px;
        }

        /* Non-card methods drop the last-4 column entirely. */
        .fields--narrow {
          grid-template-columns: 2fr 1.5fr;
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
          .fields,
          .fields--narrow {
            grid-template-columns: 1fr;
          }

          .row {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
