import React, { createContext, useContext, useState, useCallback } from 'react';

const DialogContext = createContext();

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }
  return context;
};

export const DialogProvider = ({ children }) => {
  const [dialog, setDialog] = useState(null);

  const showDialog = useCallback((message, type = 'info', title = null) => {
    setDialog({ message, type, title, isConfirm: false });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog(null);
  }, []);

  // Confirmation dialog with Yes/No buttons
  const showConfirm = useCallback((message, title = 'Confirm') => {
    return new Promise((resolve) => {
      setDialog({
        message,
        type: 'warning',
        title,
        isConfirm: true,
        onConfirm: () => {
          setDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setDialog(null);
          resolve(false);
        },
      });
    });
  }, []);

  // Convenience methods for different dialog types
  const showSuccess = useCallback((message, title = 'Success') => {
    showDialog(message, 'success', title);
  }, [showDialog]);

  const showError = useCallback((message, title = 'Error') => {
    showDialog(message, 'error', title);
  }, [showDialog]);

  const showWarning = useCallback((message, title = 'Warning') => {
    showDialog(message, 'warning', title);
  }, [showDialog]);

  const showInfo = useCallback((message, title = 'Info') => {
    showDialog(message, 'info', title);
  }, [showDialog]);

  const value = {
    dialog,
    showDialog,
    closeDialog,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };

  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
};
