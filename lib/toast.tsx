"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Toast = {
  id: number;
  message: string;
  type?: "success" | "error" | "info";
};

type ToastContextType = {
  notify: (message: string, type?: "success" | "error" | "info") => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -40, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -30, rotate: 2 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              className="relative"
            >
              {/* Rope
              <motion.div
                className="absolute left-1/2 top-[-16px] w-px h-4 bg-gray-400/70"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.3 }}
              /> */}

              {/* Toast Box */}
              <div
                className={`px-4 py-3 rounded-md shadow-md text-white text-sm font-medium min-w-[220px] text-center
                  ${
                    toast.type === "success"
                      ? "bg-green-500"
                      : toast.type === "error"
                      ? "bg-red-500"
                      : "bg-indigo-500"
                  }`}
              >
                {toast.message}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
