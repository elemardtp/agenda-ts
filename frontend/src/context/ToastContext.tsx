// Nome do arquivo: ./frontend/src/context/ToastContext.tsx
// Finalidade: Contexto para gerenciamento de toasts.
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'react-toastify';

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    if (type === 'success') toast.success(message);
    else if (type === 'error') toast.error(message);
    else if (type === 'info') toast.info(message);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};
