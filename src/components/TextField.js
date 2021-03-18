import React from "react";

const TextField = props => {
  const {
    disabled,
    className,
    value,
    onChange,
    margin,
    name,
    required,
    type
  } = props;
  return !disabled ? (
    <input
      required={required}
      style={{ backgroundColor: disabled ? "#F0F0F0" : "white" }}
      className={className}
      value={value}
      onChange={onChange}
      name={name}
      type={type}
      min="0"
    />
  ) : (
    <div>{value}</div>
  );
};

export default TextField;
