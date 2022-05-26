import React from "react";

const Input = ({ id, type = "text", value, onChange }) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(event) => onChange({ id, value: event.currentTarget.value })}
      onClick={(event) => event.stopPropagation()}
    />
  );
};

export default Input;
