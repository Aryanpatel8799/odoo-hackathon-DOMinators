import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message) => {
    addToast(message, 'success');
  }, [addToast]);

  const showError = useCallback((message) => {
    addToast(message, 'error');
  }, [addToast]);

  const showWarning = useCallback((message) => {
    addToast(message, 'warning');
  }, [addToast]);

  const showInfo = useCallback((message) => {
    addToast(message, 'info');
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}; 