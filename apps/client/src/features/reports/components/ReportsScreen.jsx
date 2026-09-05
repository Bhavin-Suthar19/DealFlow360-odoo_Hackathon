import React from 'react';
import KPICard from '../../../components/KPICard';
import ActionButtonRow from '../../../components/ActionButtonRow';

export const ReportsScreen = () => {
  const exportCSV = () => {
    alert('Exporting DealFlow360 Executive Governance & Revenue Report to CSV...');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>Screen 15 — Admin Governance & Revenue Analytics</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Filtered KPI trends, margin audit reports, and executive analytics exports</p>
        </div>
        <button
          onClick={exportCSV}
          style={{
            padding: '10px 18px',
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          📥 Export CSV Audit Report
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <KPICard title="Total ARR Booked" value="$2.45M" trend="+18.4% YoY" trendType="positive" icon="📈" />
        <KPICard title="Average Approval SLA" value="3.4 Hours" trend="-1.2 hrs" trendType="positive" icon="⏱️" />
        <KPICard title="Governance Policy Adherence" value="98.2%" trend="High Compliance" trendType="positive" icon="✅" />
        <KPICard title="Margin Realization" value="84.6%" trend="Target 85%" trendType="positive" icon="💎" />
      </div>

      {/* Analytics Breakdown Card */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginTop: 0, marginBottom: '16px' }}>Deal Stage Velocity & Conversion Analytics</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>Draft → Approval Conversion</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#38bdf8', marginTop: '4px' }}>88.4%</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Avg time: 1.2 days</div>
          </div>
          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>Approval → Negotiation Release</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#34d399', marginTop: '4px' }}>92.1%</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Avg time: 0.4 days</div>
          </div>
          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>Negotiation → Confirmed Close</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#fbbf24', marginTop: '4px' }}>76.5%</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Avg time: 4.8 days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsScreen;
