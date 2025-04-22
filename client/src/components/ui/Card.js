import React from "react";

const Card = ({ children, className }) => (
  <div className={`hover:shadow-xl transition-shadow bg-white rounded-xl ${className}`}>
    {children}
  </div>
);

export { Card };
