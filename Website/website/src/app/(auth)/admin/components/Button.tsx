type ButtonProps = {
  label: string;
  onClick: ({ ...props }) => void;
  variant?: "primary" | "secondary";
};

export const Button = ({
  label,
  onClick,
  variant = "primary",
}: ButtonProps) => {
  const styles =
    variant === "primary"
      ? "bg-blue-500 text-white"
      : "bg-gray-200 text-gray-800";

  return (
    <button onClick={onClick} className={`px-4 py-2 rounded ${styles}`}>
      {label}
    </button>
  );
};
