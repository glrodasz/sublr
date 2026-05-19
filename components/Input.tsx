import React from "react";
import type { FieldChange } from "../types";

const noop = (_change: FieldChange) => {};

const srOnly: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};

interface Props {
  id: string;
  type?: string;
  value?: string | number;
  onChange?: (change: FieldChange) => void;
  onBlur?: (change: FieldChange) => void;
  maxLength?: number;
  placeholder?: string;
  label?: string;
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
  label,
  className = "",
}: Props) => {
  return (
    <>
      <label htmlFor={id} style={srOnly}>
        {label ?? placeholder ?? id}
      </label>
      <input
        className={className}
        id={id}
        aria-label={label ?? placeholder ?? id}
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange({ id, value: event.currentTarget.value })}
        onBlur={(event) => onBlur({ id, value: event.currentTarget.value })}
        onClick={(event) => event.stopPropagation()}
        placeholder={placeholder}
      />
    </>
  );
};

export default Input;
