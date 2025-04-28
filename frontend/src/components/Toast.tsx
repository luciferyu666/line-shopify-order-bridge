import React, { createContext, useContext, useState, useCallback } from "react";
import "./toast.css";

type ToastMsg = {
  id: number;
  text: string;
  type?: "success" | "error" | "info";
};

const ToastContext = createContext<(msg: Omit<ToastMsg, "id">) => void>(
  () => {}
);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const push = useCallback((msg: Omit<ToastMsg, "id">) => {
    const id = Date.now();
    setToasts((ts) => [...ts, { ...msg, id }]);
    setTimeout(() => {
      setToasts((ts) => ts.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="toast-wrapper">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type || "info"}`}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
