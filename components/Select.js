import React from "react";

const Select = ({ id, options, value, onChange }) => {
  return (
    <select
      id={id}
      value={value}
      onChange={event => onChange({ id, value: event.currentTarget.value })}
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
