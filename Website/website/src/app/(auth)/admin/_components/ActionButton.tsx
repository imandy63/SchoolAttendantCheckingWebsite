import { useState, useRef, useEffect } from "react";

interface Action {
  label: string;
  onClick: () => void;
}

interface ActionButtonProps {
  actions: Action[];
  buttonLabel: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  actions,
  buttonLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600"
      >
        {buttonLabel}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionButton;
