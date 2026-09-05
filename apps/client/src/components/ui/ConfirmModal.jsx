import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, CheckCircle2, Info, HelpCircle, XCircle } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'Please confirm this action to proceed.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary', // 'primary' | 'danger' | 'warning' | 'success' | 'info'
  icon: CustomIcon = null,
  isAlertOnly = false
}) => {
  if (!isOpen) return null;

  const getVariantProps = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: CustomIcon || XCircle,
          iconBg: 'bg-rose-100 text-rose-600',
          btnVariant: 'danger'
        };
      case 'warning':
        return {
          icon: CustomIcon || AlertTriangle,
          iconBg: 'bg-amber-100 text-amber-600',
          btnVariant: 'warning'
        };
      case 'success':
        return {
          icon: CustomIcon || CheckCircle2,
          iconBg: 'bg-emerald-100 text-emerald-600',
          btnVariant: 'success'
        };
      case 'info':
        return {
          icon: CustomIcon || Info,
          iconBg: 'bg-purple-100 text-[#714B67]',
          btnVariant: 'primary'
        };
      case 'primary':
      default:
        return {
          icon: CustomIcon || HelpCircle,
          iconBg: 'bg-purple-100 text-[#714B67]',
          btnVariant: 'primary'
        };
    }
  };

  const { icon: Icon, iconBg, btnVariant } = getVariantProps();

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl shrink-0 ${iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="space-y-1 pt-1">
            <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          {!isAlertOnly && (
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
          )}
          <Button variant={btnVariant} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
