import { ClassNames } from "@emotion/react";
import React from "react";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className,
}) => {
  const buttonStyle =
    variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-300 text-black";
  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      className={`px-4 py-2 rounded ${buttonStyle} ${className} ${
        disabled ? disabledStyle : "hover:opacity-80"
      } transition`}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
