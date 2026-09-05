import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';

export const InvoicesList = () => {
  const navigate = useNavigate();

  const invoices = [
    { id: 'INV-1092', customer: 'Acme Corp', amount: '$145,000.00', dueDate: 'Oct 30, 2026', status: 'UNPAID', daysOverdue: 0 },
    { id: 'INV-1091', customer: 'TechStart Inc', amount: '$42,000.00', dueDate: 'Sep 15, 2026', status: 'PAID', daysOverdue: 0 },
    { id: 'INV-1088', customer: 'Global Logistics', amount: '$52,500.00', dueDate: 'Aug 01, 2026', status: 'OVERDUE', daysOverdue: 35 },
  ];

  const columns = [
    { header: 'Invoice #', accessor: 'id', render: (r) => <span style={{ fontWeight: '700', color: '#38bdf8' }}>{r.id}</span> },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Billed Amount', accessor: 'amount', render: (r) => <span style={{ fontWeight: '700', color: '#f8fafc' }}>{r.amount}</span> },
    { header: 'Payment Due Date', accessor: 'dueDate' },
    { header: 'Status', accessor: 'status', render: (r) => <Badge status={r.status} /> },
    { header: 'Aging / Notes', accessor: 'daysOverdue', render: (r) => r.daysOverdue > 0 ? <span style={{ color: '#f87171', fontWeight: '600' }}>{r.daysOverdue} days overdue</span> : <span style={{ color: '#94a3b8' }}>On track</span> },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>Screen 12 — Invoices & Accounts Receivable</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Billed invoice ledger, aging tracking, and payment collection status</p>
      </div>

      <DataTable columns={columns} data={invoices} onRowClick={(r) => navigate(`/invoices/${r.id}`)} />
    </div>
  );
};

export default InvoicesList;
