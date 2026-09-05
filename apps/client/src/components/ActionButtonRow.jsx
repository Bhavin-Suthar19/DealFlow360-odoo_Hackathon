import React from 'react';

export const ActionButtonRow = ({ primary, secondary, destructive, align = 'right' }) => {
  const getJustify = () => {
    if (align === 'left') return 'flex-start';
    if (align === 'center') return 'center';
    if (align === 'between') return 'space-between';
    return 'flex-end';
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: getJustify(),
        gap: '12px',
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '1px solid #1e293b',
      }}
    >
      {destructive && (
        <button
          onClick={destructive.onClick}
          disabled={destructive.disabled}
          style={{
            padding: '10px 18px',
            backgroundColor: '#7f1d1d',
            color: '#fca5a5',
            border: '1px solid #991b1b',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: destructive.disabled ? 'not-allowed' : 'pointer',
            opacity: destructive.disabled ? 0.6 : 1,
          }}
        >
          {destructive.label}
        </button>
      )}

      {secondary && (
        <button
          onClick={secondary.onClick}
          disabled={secondary.disabled}
          style={{
            padding: '10px 18px',
            backgroundColor: '#1e293b',
            color: '#cbd5e1',
            border: '1px solid #334155',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: secondary.disabled ? 'not-allowed' : 'pointer',
            opacity: secondary.disabled ? 0.6 : 1,
          }}
        >
          {secondary.label}
        </button>
      )}

      {primary && (
        <button
          onClick={primary.onClick}
          disabled={primary.disabled}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0284c7',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: primary.disabled ? 'not-allowed' : 'pointer',
            opacity: primary.disabled ? 0.6 : 1,
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)',
          }}
        >
          {primary.label}
        </button>
      )}
    </div>
  );
};

export default ActionButtonRow;
