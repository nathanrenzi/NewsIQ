import React from "react";

const Input = ({ type, placeholder, value, onChange, className }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`w-full text-xl p-4 rounded-2xl shadow-lg ${className}`}
  />
);

export { Input };
