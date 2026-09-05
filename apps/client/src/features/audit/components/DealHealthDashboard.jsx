import React from 'react';
import { useNavigate } from 'react-router-dom';
import KPICard from '../../../components/KPICard';
import Badge from '../../../components/Badge';

export const DealHealthDashboard = () => {
  const navigate = useNavigate();

  const flaggedDeals = [
    { id: 'QT-9021', customer: 'Acme Corp', amount: '$145,000', riskType: 'Discount Anomaly (18% vs 15% limit)', daysInStage: '12 days in Negotiation', rep: 'John Sales', riskLevel: 'HIGH' },
    { id: 'QT-9019', customer: 'Vortex Global', amount: '$510,000', riskType: 'Stalled Deal (>14 days in Pending)', daysInStage: '18 days in Pending', rep: 'Sarah Rep', riskLevel: 'HIGH' },
    { id: 'QT-9022', customer: 'TechStart Inc', amount: '$42,000', riskType: 'Margin Erosion Warning', daysInStage: '4 days in Pending', rep: 'Sarah Rep', riskLevel: 'MEDIUM' },
  ];

  const handleNudgeRep = (e, dealId) => {
    e.stopPropagation();
    alert(`One-click nudge notification sent to rep for deal ${dealId}!`);
  };

  const handleEscalateManager = (e, dealId) => {
    e.stopPropagation();
    alert(`Deal ${dealId} escalated to VP of Sales!`);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>Screen 14 — Deal Health & Governance Anomaly Dashboard</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Proactively detect stalled deals, discount anomalies, and delivery slippage before revenue impact</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <KPICard title="Stalled Deals (>10 days)" value="4 Deals" trend="+1 this week" trendType="negative" icon="⚠️" />
        <KPICard title="Discount Anomaly Flags" value="3 Flagged" trend="2 High Risk" trendType="negative" icon="📉" />
        <KPICard title="Delivery Slippage Risk" value="1 Order" trend="Warehouse Split" trendType="positive" icon="📦" />
        <KPICard title="Health Risk Score" value="92.4 / 100" trend="Good Standing" trendType="positive" icon="🛡️" />
      </div>

      {/* Flagged Anomaly Matrix */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', marginBottom: '16px' }}>
          Deals Requiring Low-Friction Managerial Intervention
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {flaggedDeals.map((deal) => (
            <div
              key={deal.id}
              onClick={() => navigate(`/quotations/${deal.id}`)}
              style={{
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0284c7')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#334155')}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '800', color: '#38bdf8', fontSize: '16px' }}>{deal.id}</span>
                  <span style={{ fontSize: '15px', color: '#f8fafc', fontWeight: '700' }}>{deal.customer}</span>
                  <Badge status={deal.riskLevel} />
                </div>
                <div style={{ fontSize: '14px', color: '#fbbf24', fontWeight: '600', marginBottom: '4px' }}>
                  🚨 {deal.riskType}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Assigned Rep: <strong>{deal.rep}</strong> • {deal.daysInStage} • Deal Value: <strong style={{ color: '#34d399' }}>{deal.amount}</strong>
                </div>
              </div>

              {/* Low-Friction One-Click Actions (Design Brief Requirement) */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={(e) => handleNudgeRep(e, deal.id)}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#1e293b',
                    color: '#38bdf8',
                    border: '1px solid #0284c7',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  ⚡ One-Click Nudge Rep
                </button>
                <button
                  onClick={(e) => handleEscalateManager(e, deal.id)}
                  style={{
                    padding: '8px 14px',
                    backgroundColor: '#7f1d1d',
                    color: '#fca5a5',
                    border: '1px solid #991b1b',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  🔥 Escalate to VP
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DealHealthDashboard;
