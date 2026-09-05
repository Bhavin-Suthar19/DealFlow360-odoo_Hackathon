import React, { useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

export const ToastContainer = ({ toasts = [], onCloseToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <SingleToast key={toast.id} toast={toast} onClose={() => onCloseToast(toast.id)} />
      ))}
    </div>
  );
};

const SingleToast = ({ toast, onClose }) => {
  const { title, message, variant = 'success', duration = 4000 } = toast;

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          bg: 'bg-white border-rose-200 shadow-rose-900/10',
          iconBg: 'bg-rose-100 text-rose-600',
          titleColor: 'text-rose-950',
          Icon: XCircle
        };
      case 'warning':
        return {
          bg: 'bg-white border-amber-200 shadow-amber-900/10',
          iconBg: 'bg-amber-100 text-amber-600',
          titleColor: 'text-amber-950',
          Icon: AlertTriangle
        };
      case 'info':
      case 'primary':
        return {
          bg: 'bg-white border-purple-200 shadow-purple-900/10',
          iconBg: 'bg-purple-100 text-[#714B67]',
          titleColor: 'text-purple-950',
          Icon: Info
        };
      case 'success':
      default:
        return {
          bg: 'bg-white border-emerald-200 shadow-emerald-900/10',
          iconBg: 'bg-emerald-100 text-emerald-600',
          titleColor: 'text-emerald-950',
          Icon: CheckCircle2
        };
    }
  };

  const { bg, iconBg, titleColor, Icon } = getVariantStyles();

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border shadow-xl transition-all duration-300 transform translate-y-0 ${bg}`}
      role="alert"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          {title && <h4 className={`text-xs font-bold ${titleColor} truncate`}>{title}</h4>}
          {message && <p className="text-xs text-slate-600 leading-snug line-clamp-2">{message}</p>}
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors shrink-0 cursor-pointer"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ToastContainer;
