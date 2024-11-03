import React, { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "warning" | "info";
interface Toast {
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextProps {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (
    message: string,
    type: ToastType = "success",
    duration: number = 3000
  ) => {
    setToast({ message, type, duration });

    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      <style jsx>{`
        .toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: #fff;
          padding: 1rem;
          border-radius: 5px;
          opacity: 0.9;
          z-index: 1000;
          transition: opacity 0.3s ease;
        }
        .toast.success {
          background-color: #4caf50;
        }
        .toast.error {
          background-color: #f44336;
        }
        .toast.warning {
          background-color: #ff9800;
        }
        .toast.info {
          background-color: #2196f3;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
