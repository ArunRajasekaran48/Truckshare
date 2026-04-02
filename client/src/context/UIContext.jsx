import { createContext, useState, useCallback } from 'react';

export const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [modals, setModals] = useState({});

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => showToast(msg, 'success', 3500),
    error: (msg) => showToast(msg, 'error', 5000),
    warning: (msg) => showToast(msg, 'warning', 4000),
    info: (msg) => showToast(msg, 'info', 3500),
  };

  const openModal = useCallback((modalId) => {
    setModals((prev) => ({ ...prev, [modalId]: true }));
  }, []);

  const closeModal = useCallback((modalId) => {
    setModals((prev) => ({ ...prev, [modalId]: false }));
  }, []);

  const value = { toasts, dismissToast, toast, modals, openModal, closeModal };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
