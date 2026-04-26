import React from "react";
import type { FieldChange } from "../types";

interface Option {
  label: string;
  value: string;
}

interface Props {
  id: string;
  options: Option[];
  value?: string;
  onChange: (change: FieldChange) => void;
}

const Select = ({ id, options, value, onChange }: Props) => {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange({ id, value: event.currentTarget.value })}
      onClick={(event) => event.stopPropagation()}
    >
      {options.map(({ label, value }) => (
        <option key={label} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default Select;
