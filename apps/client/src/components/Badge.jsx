import React from 'react';

export const Badge = ({ status, variant = 'default', children }) => {
  const getStyles = () => {
    const val = (status || children || '').toString().toUpperCase();

    if (['HIGH', 'REJECTED', 'CANCELLED', 'OVERDUE', 'FLAGGED'].includes(val) || variant === 'danger') {
      return { bg: '#451a03', color: '#f87171', border: '#7f1d1d' };
    }
    if (['MEDIUM', 'PENDING', 'PAUSED', 'DRAFT', 'NEGOTIATION', 'RETURNED'].includes(val) || variant === 'warning') {
      return { bg: '#451a03', color: '#fbbf24', border: '#78350f' };
    }
    if (['LOW', 'APPROVED', 'ACTIVE', 'PAID', 'CONFIRMED', 'SHIPPED'].includes(val) || variant === 'success') {
      return { bg: '#064e3b', color: '#34d399', border: '#065f46' };
    }
    return { bg: '#1e293b', color: '#94a3b8', border: '#334155' };
  };

  const style = getStyles();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.025em',
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {children || status}
    </span>
  );
};

export default Badge;
