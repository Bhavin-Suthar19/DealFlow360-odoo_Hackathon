import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmModal from '../components/ui/ConfirmModal';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'OK',
    cancelText: 'Cancel',
    variant: 'primary',
    isAlertOnly: false,
    onConfirm: null,
    onCancel: null
  });

  const showAlert = useCallback(({ title = 'Notice', message = '', variant = 'success', onConfirm = null }) => {
    setModalConfig({
      isOpen: true,
      title,
      message,
      confirmText: 'OK',
      variant,
      isAlertOnly: true,
      onConfirm: () => {
        if (onConfirm) onConfirm();
      },
      onCancel: null
    });
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
      isAlertOnly: false,
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
      if (prev.onCancel && !prev.isAlertOnly) {
        prev.onCancel();
      }
      return { ...prev, isOpen: false };
    });
  }, []);

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, closeModal }}>
      {children}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        variant={modalConfig.variant}
        isAlertOnly={modalConfig.isAlertOnly}
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
