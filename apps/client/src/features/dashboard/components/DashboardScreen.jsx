import React from 'react';
import { useNavigate } from 'react-router-dom';
import KPICard from '../../../components/KPICard';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';

export const DashboardScreen = () => {
  const navigate = useNavigate();

  const mockActiveQuotes = [
    { id: 'QT-9021', customer: 'Acme Corp', amount: '$145,000', stage: 'NEGOTIATION', risk: 'HIGH', updated: '10 mins ago' },
    { id: 'QT-9022', customer: 'TechStart Inc', amount: '$42,000', stage: 'PENDING', risk: 'MEDIUM', updated: '1 hour ago' },
    { id: 'QT-9023', customer: 'Global Logistics', amount: '$210,000', stage: 'APPROVED', risk: 'LOW', updated: '3 hours ago' },
    { id: 'QT-9024', customer: 'Nexus Health', amount: '$88,500', stage: 'DRAFT', risk: 'LOW', updated: 'Yesterday' },
  ];

  const columns = [
    { header: 'Quote ID', accessor: 'id', render: (row) => <span style={{ fontWeight: '700', color: '#38bdf8' }}>{row.id}</span> },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Deal Amount', accessor: 'amount' },
    { header: 'Stage', accessor: 'stage', render: (row) => <Badge status={row.stage} /> },
    { header: 'Risk Assessment', accessor: 'risk', render: (row) => <Badge status={row.risk} /> },
    { header: 'Last Activity', accessor: 'updated' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>Screen 2 — Sales Dashboard & Hub</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Real-time CPQ pipeline metrics and governance action center</p>
        </div>
        <button
          onClick={() => navigate('/quotations/new')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)',
          }}
        >
          + Create New Quote
        </button>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <KPICard title="Total Pipeline Value" value="$1.48M" trend="14.2%" trendType="positive" subtext="Across 34 active deals" icon="💰" />
        <KPICard title="Pending Approvals" value="6 Deals" trend="2 over limit" trendType="negative" subtext="Average turnaround 4.2 hrs" icon="⏳" />
        <KPICard title="Avg Blended Discount" value="11.4%" trend="-1.8%" trendType="positive" subtext="Target ceiling 15.0%" icon="🎯" />
        <KPICard title="Fulfillment Release" value="94.2%" trend="98.5% SLA" trendType="positive" subtext="3 backorder splits" icon="📦" />
      </div>

      {/* Active Pipeline Table */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: '#f8fafc' }}>Recent Priority Quotes</h2>
          <button onClick={() => navigate('/quotations')} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            View All Quotes →
          </button>
        </div>

        <DataTable columns={columns} data={mockActiveQuotes} onRowClick={(row) => navigate(`/quotations/${row.id}`)} />
      </div>
    </div>
  );
};

export default DashboardScreen;
