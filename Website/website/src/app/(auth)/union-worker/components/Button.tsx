import React from "react";

interface ButtonProps {
  label: string;
  variant: "primary" | "secondary" | "danger" | "success";
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ label, variant, onClick }) => {
  const variantClass = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-300 text-black hover:bg-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${variantClass[variant]}`}
    >
      {label}
    </button>
  );
};
