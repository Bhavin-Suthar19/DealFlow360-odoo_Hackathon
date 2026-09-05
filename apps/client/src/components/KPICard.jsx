import React from 'react';

export const KPICard = ({ title, value, subtext, trend, trendType = 'positive', icon }) => {
  const isPositive = trendType === 'positive';
  const trendColor = isPositive ? '#34d399' : '#f87171';

  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>{title}</span>
        {icon && <span style={{ fontSize: '18px' }}>{icon}</span>}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{ fontSize: '28px', fontWeight: '700', color: '#f8fafc' }}>{value}</span>
        {trend && (
          <span style={{ fontSize: '12px', color: trendColor, fontWeight: '600' }}>
            {isPositive ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>

      {subtext && <span style={{ fontSize: '12px', color: '#64748b' }}>{subtext}</span>}
    </div>
  );
};

export default KPICard;
