type ButtonProps = {
  label: string;
  onClick: ({ ...props }) => void;
  variant?: "primary" | "secondary";
  type?: "submit" | "reset" | "button";
  className?: string;
};

export const Button = ({
  label,
  onClick,
  type,
  className,
  variant = "primary",
}: ButtonProps) => {
  const styles =
    variant === "primary"
      ? "bg-blue-500 text-white"
      : "bg-gray-200 text-gray-800";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded ${styles} ${className}`}
    >
      {label}
    </button>
  );
};
