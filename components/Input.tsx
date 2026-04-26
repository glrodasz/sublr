import React from "react";
import type { FieldChange } from "../types";

const noop = (_change: FieldChange) => {};

interface Props {
  id: string;
  type?: string;
  value?: string | number;
  onChange?: (change: FieldChange) => void;
  onBlur?: (change: FieldChange) => void;
  maxLength?: number;
  placeholder?: string;
  className?: string;
}

const Input = ({
  id,
  type = "text",
  value,
  onChange = noop,
  onBlur = noop,
  maxLength,
  placeholder,
  className = "",
}: Props) => {
  return (
    <input
      className={className}
      id={id}
      type={type}
      value={value}
      maxLength={maxLength}
      onChange={(event) => onChange({ id, value: event.currentTarget.value })}
      onBlur={(event) => onBlur({ id, value: event.currentTarget.value })}
      onClick={(event) => event.stopPropagation()}
      placeholder={placeholder}
    />
  );
};

export default Input;
