// src/components/Button.tsx
type ButtonProps = {
    label: string;
    onClick?: () => void;
    variant?: "primary" | "secondary";
    type?: "button" | "submit";
  };
  
  export const Button = ({ label, onClick, variant = "primary", type = "button" }: ButtonProps) => {
    const className = variant === "primary" ? "bg-blue-500 text-white" : "bg-gray-200 text-black";
    return (
      <button type={type} onClick={onClick} className={`p-2 rounded ${className}`}>
        {label}
      </button>
    );
  };
  