// src/components/Button.tsx
type ButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  className?: string;
};

export const Button = ({
  label,
  onClick,
  variant = "primary",
  type = "button",
  className,
}: ButtonProps) => {
  const defaultClassName =
    variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-200 text-black";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`p-2 rounded ${defaultClassName} ${className}`}
    >
      {label}
    </button>
  );
};
