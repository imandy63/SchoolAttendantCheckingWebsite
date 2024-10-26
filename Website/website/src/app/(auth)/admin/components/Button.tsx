// src/app/admin/components/Button.tsx
import React from 'react';

type ButtonProps = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
};

export const Button: React.FC<ButtonProps> = ({ label, onClick, type = "button", variant = "primary" }) => {
  const buttonStyle = variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-300 text-black";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded ${buttonStyle} hover:opacity-80 transition`}
    >
      {label}
    </button>
  );
};
