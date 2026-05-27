import React from "react";
import type { Currency, FieldChange } from "../types";
import { LANG_PER_CURRENCY } from "../constants";

interface Props {
  id: string;
  currency: Currency;
  value?: string | number;
  onChange?: (change: FieldChange) => void;
  className?: string;
}

const getSeparators = (locale: string) => {
  const parts = new Intl.NumberFormat(locale).formatToParts(11111.1);
  return {
    group: parts.find((part) => part.type === "group")?.value ?? ",",
    decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
  };
};

// Keep only digits plus a single decimal separator, normalized to "." for storage.
const toRawNumber = (input: string, decimal: string) => {
  const allowed = input.replace(new RegExp(`[^0-9${decimal === "." ? "\\." : decimal}]`, "g"), "");
  const [whole, ...rest] = allowed.split(decimal);
  return rest.length ? `${whole}.${rest.join("")}` : whole;
};

// Format a raw numeric string with locale grouping, preserving a trailing/in-progress decimal.
const toDisplay = (raw: string, locale: string, decimal: string) => {
  if (raw === "" || raw === ".") return raw === "." ? decimal : "";
  const [whole, fraction] = raw.split(".");
  const groupedWhole = Number(whole || "0").toLocaleString(locale, { maximumFractionDigits: 0 });
  return fraction !== undefined ? `${groupedWhole}${decimal}${fraction}` : groupedWhole;
};

const CurrencyInput = ({ id, currency, value, onChange, className = "" }: Props) => {
  const locale = LANG_PER_CURRENCY[currency];
  const { decimal } = getSeparators(locale);
  const raw = value === undefined || value === null ? "" : String(value);
  const display = toDisplay(raw, locale, decimal);

  return (
    <input
      className={className}
      id={id}
      aria-label="Price"
      type="text"
      inputMode="decimal"
      value={display}
      onChange={(event) =>
        onChange?.({ id, value: toRawNumber(event.currentTarget.value, decimal) })
      }
      onClick={(event) => event.stopPropagation()}
    />
  );
};

export default CurrencyInput;
