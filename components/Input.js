import React from "react";

const noop = () => {};

const Input = ({
  id,
  type = "text",
  value,
  onChange = noop,
  onBlur = noop,
  maxLength,
  placeholder
}) => {
  return (
    <input
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
