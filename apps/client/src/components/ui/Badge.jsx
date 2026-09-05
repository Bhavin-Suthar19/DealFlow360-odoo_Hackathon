import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    draft: 'bg-slate-100 text-slate-600 border-slate-300',
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    negotiation: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    cyan: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    brand: 'bg-[#714B67]/10 text-[#714B67] border-[#714B67]/30',
    purple: 'bg-[#714B67]/10 text-[#714B67] border-[#714B67]/30'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant] || variantStyles.default} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
