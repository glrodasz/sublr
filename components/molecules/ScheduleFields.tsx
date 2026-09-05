import { Select } from "../atoms/Select";
import { TextField } from "../atoms/TextField";
import type { Frequency } from "../../types";

export interface ScheduleValue {
  /** MONTHLY / QUARTERLY / YEARLY: payment day, 1–31. */
  dayOfMonth: number;
  /** YEARLY: month, 0–11. */
  month: number;
  /** ONE_TIME / WEEKLY / BIWEEKLY: the date, YYYY-MM-DD. */
  date: string;
}

interface Props {
  frequency: Frequency;
  value: ScheduleValue;
  onChange: (patch: Partial<ScheduleValue>) => void;
  disabled?: boolean;
}

const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i),
  label: new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(2026, i, 1)),
}));

/**
 * The date control a frequency actually needs — nothing more. Monthly and
 * quarterly items repeat on a day; yearly ones on a month and day; weekly ones
 * start on a date; a one-time item *is* a date. The caller owns the frequency
 * selector (or fixes the frequency, as the wizard's cadence sections do) and
 * feeds the result to helpers/scheduleAnchor.
 */
export function ScheduleFields({ frequency, value, onChange, disabled }: Props) {
  switch (frequency) {
    case "MONTHLY":
    case "QUARTERLY":
      return (
        <Select
          label="Payment day"
          options={DAY_OPTIONS}
          value={String(value.dayOfMonth)}
          disabled={disabled}
          onValueChange={(v) => onChange({ dayOfMonth: Number(v) })}
        />
      );
    case "YEARLY":
      return (
        <>
          <Select
            label="Month"
            options={MONTH_OPTIONS}
            value={String(value.month)}
            disabled={disabled}
            onValueChange={(v) => onChange({ month: Number(v) })}
          />
          <Select
            label="Day"
            options={DAY_OPTIONS}
            value={String(value.dayOfMonth)}
            disabled={disabled}
            onValueChange={(v) => onChange({ dayOfMonth: Number(v) })}
          />
        </>
      );
    case "WEEKLY":
    case "BIWEEKLY":
      return (
        <TextField
          label="Starts on"
          type="date"
          value={value.date}
          disabled={disabled}
          onValueChange={(v) => onChange({ date: v })}
        />
      );
    case "ONE_TIME":
      return (
        <TextField
          label="Date"
          type="date"
          value={value.date}
          disabled={disabled}
          onValueChange={(v) => onChange({ date: v })}
        />
      );
  }
}
