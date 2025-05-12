import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Generate className based on the type
  const backgroundColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  return (
    <div
      className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 px-4 py-3 text-white rounded-lg shadow-md flex items-center gap-2 z-50 ${backgroundColor}`}
    >
      {type === "success" && <FiCheckCircle />}
      {type === "error" && <FiAlertCircle />}
      {type === "info" && <FiInfo />}
      <span>{message}</span>
    </div>
  );
};

const ToastManager = () => {
  const [toasts, setToasts] = useState([]);

  // Add toast to the queue
  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // Global method to trigger toast
  window.showToast = addToast;

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToasts((prev) => prev.filter((t) => t.id !== toast.id))
          }
        />
      ))}
    </>
  );
};

export default ToastManager;
