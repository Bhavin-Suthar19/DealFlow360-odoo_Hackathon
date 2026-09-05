import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';

export const ApprovalsList = () => {
  const navigate = useNavigate();

  const approvals = [
    { id: 'AP-9021', quoteId: 'QT-9021', customer: 'Acme Corp', submitter: 'John Sales (Rep)', amount: '$145,000', risk: 'HIGH', reason: 'Line item discount 18% > 15% limit', currentStep: 'Sales Manager' },
    { id: 'AP-9022', quoteId: 'QT-9022', customer: 'TechStart Inc', submitter: 'Sarah Rep (Rep)', amount: '$42,000', risk: 'MEDIUM', reason: 'Blended margin 8% < 10% threshold', currentStep: 'Finance' },
    { id: 'AP-9020', quoteId: 'QT-9020', customer: 'Global Logistics', submitter: 'John Sales (Rep)', amount: '$210,000', risk: 'LOW', reason: 'Custom payment terms (Net 60)', currentStep: 'VP Sales' },
  ];

  const columns = [
    { header: 'Approval ID', accessor: 'id', render: (r) => <span style={{ fontWeight: '700', color: '#38bdf8' }}>{r.id}</span> },
    { header: 'Quote Ref', accessor: 'quoteId' },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Submitter', accessor: 'submitter' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Risk Score', accessor: 'risk', render: (r) => <Badge status={r.risk} /> },
    { header: 'Flag Reason', accessor: 'reason', render: (r) => <span style={{ color: '#fbbf24', fontSize: '13px' }}>{r.reason}</span> },
    { header: 'Current Stage', accessor: 'currentStep', render: (r) => <Badge status="PENDING">{r.currentStep}</Badge> },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>Screen 5 — Governance Approval Queue</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Quotes auto-flagged by policy limits awaiting managerial / finance sign-off</p>
      </div>

      <DataTable columns={columns} data={approvals} onRowClick={(r) => navigate(`/approvals/${r.id}`)} />
    </div>
  );
};

export default ApprovalsList;
