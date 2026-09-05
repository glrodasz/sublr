import { useEffect, useMemo, useState } from "react";
import { Modal } from "../../../components/molecules/Modal";
import { Select } from "../../../components/atoms/Select";
import { TextField } from "../../../components/atoms/TextField";
import { Button } from "../../../components/atoms/Button";
import { useCategories } from "../../../hooks/useCategories";
import { usePaymentMethods } from "../../../hooks/usePaymentMethods";
import { useRecurringItems } from "../../../hooks/useRecurringItems";
import { useUserDoc } from "../../../hooks/useUserDoc";
import { DOMAIN_CONFIG } from "../helpers/domainConfig";
import { SELECTABLE_CURRENCIES, CURRENCY_SYMBOL, FREQUENCY_LABELS } from "../../../constants";
import type { Currency, Domain, Frequency, RecurrentTransaction } from "../../../types";

const FREQUENCY_OPTIONS = (Object.keys(FREQUENCY_LABELS) as Frequency[]).map((f) => ({
  value: f,
  label: FREQUENCY_LABELS[f],
}));

const CURRENCY_OPTIONS = SELECTABLE_CURRENCIES.map((c) => ({
  value: c.value,
  label: `${CURRENCY_SYMBOL[c.value]} ${c.label}`,
}));

interface Props {
  domain: Domain;
  open: boolean;
  /** Present = edit; absent = create. */
  item?: RecurrentTransaction;
  onClose: () => void;
}

interface FormState {
  categoryId: string;
  name: string;
  amount: string;
  currency: Currency | "";
  frequency: Frequency;
  paymentMethodId: string;
  chargedEnabled: boolean;
  chargedAmount: string;
  chargedCurrency: Currency | "";
}

export function RecurrentTransactionModal({ domain, open, item, onClose }: Props) {
  const config = DOMAIN_CONFIG[domain];
  const { userDoc } = useUserDoc();
  const { categories } = useCategories(domain);
  const { methods } = usePaymentMethods();
  const { create, update } = useRecurringItems(domain);

  const empty: FormState = useMemo(
    () => ({
      categoryId: "",
      name: "",
      amount: "",
      currency: "",
      frequency: "MONTHLY",
      paymentMethodId: "",
      chargedEnabled: false,
      chargedAmount: "",
      chargedCurrency: "",
    }),
    []
  );

  const [form, setForm] = useState<FormState>(empty);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Re-seed whenever the modal opens for a different target.
  useEffect(() => {
    if (!open) return;
    setFormError(null);
    setForm(
      item
        ? {
            categoryId: item.categoryId,
            name: item.name,
            amount: String(item.amount),
            currency: item.currency,
            frequency: item.frequency,
            paymentMethodId: item.paymentMethodId ?? "",
            chargedEnabled: item.chargedAmount !== undefined,
            chargedAmount: item.chargedAmount !== undefined ? String(item.chargedAmount) : "",
            chargedCurrency: item.chargedCurrency ?? "",
          }
        : empty
    );
  }, [open, item, empty]);

  const patch = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }));

  // Per-item currency default: the chosen method's defaultCurrency, stored
  // since onboarding but read by nobody until now; mainCurrency otherwise.
  const effectiveCurrency: Currency =
    form.currency ||
    methods.find((m) => m.id === form.paymentMethodId)?.defaultCurrency ||
    userDoc?.mainCurrency ||
    "USD";

  const onSelectMethod = (paymentMethodId: string) => {
    const method = methods.find((m) => m.id === paymentMethodId);
    patch({
      paymentMethodId,
      ...(form.currency === "" && method?.defaultCurrency
        ? { currency: method.defaultCurrency }
        : {}),
    });
  };

  const categoryOptions = categories
    .filter((c) => !c.parentId)
    .map((c) => ({ value: c.id!, label: c.name }));
  const methodOptions = methods.map((m) => ({
    value: m.id!,
    label: m.network ? `${m.name} (${m.network})` : m.name,
  }));

  const submit = async () => {
    const amount = Number(form.amount);
    if (!form.categoryId) return setFormError("Pick a category");
    if (!form.name.trim()) return setFormError("Give it a name");
    if (!(amount > 0)) return setFormError("Amount must be greater than zero");

    const chargedAmount = form.chargedEnabled ? Number(form.chargedAmount) : undefined;
    if (form.chargedEnabled) {
      if (!(chargedAmount! > 0) || !form.chargedCurrency)
        return setFormError("Fill both charged fields or turn the toggle off");
      if (form.chargedCurrency === effectiveCurrency)
        return setFormError("Charged currency must differ from the item's currency");
    }

    setBusy(true);
    setFormError(null);
    try {
      if (item?.id) {
        await update(item.id, {
          categoryId: form.categoryId,
          name: form.name.trim(),
          amount,
          currency: effectiveCurrency,
          frequency: form.frequency,
          paymentMethodId: form.paymentMethodId || null,
          chargedAmount: form.chargedEnabled ? chargedAmount! : null,
          chargedCurrency: form.chargedEnabled ? (form.chargedCurrency as Currency) : null,
        });
      } else {
        await create({
          domain,
          categoryId: form.categoryId,
          name: form.name.trim(),
          amount,
          currency: effectiveCurrency,
          frequency: form.frequency,
          ...(form.paymentMethodId ? { paymentMethodId: form.paymentMethodId } : {}),
          ...(form.chargedEnabled
            ? { chargedAmount: chargedAmount!, chargedCurrency: form.chargedCurrency as Currency }
            : {}),
        });
      }
      onClose();
    } catch (err) {
      console.error("Failed to save recurrent transaction:", err);
      setFormError("Couldn't save — try again");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      title={
        item
          ? `Edit ${form.name || config.noun.replace(/s$/, "")}`
          : `New ${config.noun.replace(/s$/, "")}`
      }
      onClose={onClose}
    >
      <div className="form">
        <Select
          label="Category"
          placeholder="Pick a category"
          options={categoryOptions}
          value={form.categoryId}
          onValueChange={(v) => patch({ categoryId: v })}
        />

        <TextField
          label="Name"
          placeholder="Name"
          value={form.name}
          onValueChange={(v) => patch({ name: v })}
        />

        <div className="pair">
          <TextField
            label="Amount"
            placeholder="0"
            inputMode="decimal"
            prefix={CURRENCY_SYMBOL[effectiveCurrency]}
            align="right"
            value={form.amount}
            onValueChange={(v) => patch({ amount: v.replace(/[^\d.]/g, "") })}
          />
          <Select
            label="Currency"
            options={CURRENCY_OPTIONS}
            value={effectiveCurrency}
            onValueChange={(v) => patch({ currency: v as Currency })}
          />
        </div>

        <div className="pair">
          <Select
            label="Frequency"
            options={FREQUENCY_OPTIONS}
            value={form.frequency}
            onValueChange={(v) => patch({ frequency: v as Frequency })}
          />
          <Select
            label="Payment method"
            placeholder="None"
            options={methodOptions}
            value={form.paymentMethodId}
            onValueChange={onSelectMethod}
          />
        </div>

        <label className="charged-toggle">
          <input
            type="checkbox"
            checked={form.chargedEnabled}
            onChange={(e) => patch({ chargedEnabled: e.currentTarget.checked })}
          />
          Charged in a different currency
        </label>

        {form.chargedEnabled && (
          <div className="pair">
            <TextField
              label="Charged amount"
              placeholder="0"
              inputMode="decimal"
              align="right"
              value={form.chargedAmount}
              onValueChange={(v) => patch({ chargedAmount: v.replace(/[^\d.]/g, "") })}
            />
            <Select
              label="Charged currency"
              placeholder="Currency"
              options={CURRENCY_OPTIONS.filter((c) => c.value !== effectiveCurrency)}
              value={form.chargedCurrency}
              onValueChange={(v) => patch({ chargedCurrency: v as Currency })}
            />
          </div>
        )}

        {formError && <p className="form-error">{formError}</p>}

        <div className="actions">
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit} disabled={busy}>
            {busy ? "Saving…" : item ? "Save changes" : "Create"}
          </Button>
        </div>
      </div>

      <style jsx>{`
        .form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .pair {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .charged-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--fg-1);
          cursor: pointer;
        }

        .form-error {
          margin: 0;
          font-size: 0.85rem;
          color: var(--accent-hot);
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 4px;
        }

        @media (max-width: 480px) {
          .pair {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </Modal>
  );
}
