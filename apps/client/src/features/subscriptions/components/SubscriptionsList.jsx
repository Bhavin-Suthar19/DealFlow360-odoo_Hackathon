import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';

export const SubscriptionsList = () => {
  const navigate = useNavigate();

  const subscriptions = [
    { id: 'SUB-401', customer: 'Acme Corp', plan: 'Enterprise Platform Plan', arr: '$120,000 / yr', billingCycle: 'Annual Pre-paid', status: 'ACTIVE', nextBilling: 'Oct 15, 2026' },
    { id: 'SUB-402', customer: 'TechStart Inc', plan: 'Growth Tier Cloud', arr: '$42,000 / yr', billingCycle: 'Monthly Recurring', status: 'ACTIVE', nextBilling: 'Oct 01, 2026' },
    { id: 'SUB-403', customer: 'Global Logistics', plan: 'Custom Hybrid Stack', arr: '$210,000 / yr', billingCycle: 'Quarterly', status: 'PAUSED', nextBilling: 'Pending Renewal' },
  ];

  const columns = [
    { header: 'Subscription ID', accessor: 'id', render: (r) => <span style={{ fontWeight: '700', color: '#38bdf8' }}>{r.id}</span> },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Plan Type', accessor: 'plan' },
    { header: 'ARR Value', accessor: 'arr', render: (r) => <span style={{ fontWeight: '700', color: '#34d399' }}>{r.arr}</span> },
    { header: 'Billing Cadence', accessor: 'billingCycle' },
    { header: 'Status', accessor: 'status', render: (r) => <Badge status={r.status} /> },
    { header: 'Next Renewal Date', accessor: 'nextBilling' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>Screen 9 — Recurring Subscriptions Ledger</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>All active, paused, and upcoming subscription contracts across customers</p>
      </div>

      <DataTable columns={columns} data={subscriptions} onRowClick={(r) => navigate(`/subscriptions/${r.id}`)} />
    </div>
  );
};

export default SubscriptionsList;
