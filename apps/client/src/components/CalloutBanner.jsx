import React from 'react';

export const CalloutBanner = ({ title, message, type = 'warning', actionLabel, onAction, dismissible = false, onDismiss }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return { bg: '#451a03', border: '#b91c1c', icon: '🚨', text: '#fca5a5' };
      case 'info':
        return { bg: '#0c4a6e', border: '#0369a1', icon: 'ℹ️', text: '#7dd3fc' };
      case 'success':
        return { bg: '#064e3b', border: '#047857', icon: '✅', text: '#6ee7b7' };
      case 'warning':
      default:
        return { bg: '#451a03', border: '#d97706', icon: '⚠️', text: '#fcd34d' };
    }
  };

  const style = getTypeStyles();

  return (
    <div
      style={{
        backgroundColor: style.bg,
        borderLeft: `4px solid ${style.border}`,
        borderRadius: '6px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '18px' }}>{style.icon}</span>
        <div>
          {title && <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px', marginBottom: '2px' }}>{title}</div>}
          <div style={{ color: style.text, fontSize: '13px', lineHeight: '1.4' }}>{message}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {actionLabel && (
          <button
            onClick={onAction}
            style={{
              padding: '6px 12px',
              backgroundColor: style.border,
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {actionLabel}
          </button>
        )}

        {dismissible && (
          <button
            onClick={onDismiss}
            style={{
              background: 'transparent',
              border: 'none',
              color: style.text,
              fontSize: '16px',
              cursor: 'pointer',
              padding: '0 4px',
            }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default CalloutBanner;
