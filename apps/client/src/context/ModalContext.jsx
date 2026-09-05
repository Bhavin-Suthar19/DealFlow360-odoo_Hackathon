import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmModal from '../components/ui/ConfirmModal';
import ToastContainer from '../components/ui/ToastContainer';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
    variant: 'primary',
    onConfirm: null,
    onCancel: null
  });

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showAlert = useCallback(({ title = 'Notice', message = '', variant = 'success', duration = 4000, onConfirm = null }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, variant, duration }]);
    if (onConfirm) onConfirm();
  }, []);

  const showConfirm = useCallback(({
    title = 'Are you sure?',
    message = '',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'warning',
    onConfirm = null,
    onCancel = null
  }) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      variant,
      onConfirm: () => {
        if (onConfirm) onConfirm();
      },
      onCancel: () => {
        if (onCancel) onCancel();
      }
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalConfig((prev) => {
      if (prev.onCancel) {
        prev.onCancel();
      }
      return { ...prev, isOpen: false };
    });
  }, []);

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, closeModal }}>
      {children}
      <ToastContainer toasts={toasts} onCloseToast={removeToast} />
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        variant={modalConfig.variant}
        isAlertOnly={false}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export default ModalContext;
