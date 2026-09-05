import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Badge from '../../../components/Badge';
import ActionButtonRow from '../../../components/ActionButtonRow';

export const BillingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const contract = {
    id: id || 'SUB-401',
    customer: 'Acme Corp',
    startDate: 'Oct 15, 2025',
    endDate: 'Oct 14, 2026',
    status: 'ACTIVE',
    arr: '$120,000',
    prorationDays: 14,
    proratedCredit: '-$4,602.74',
  };

  const lineItems = [
    { type: 'Recurring Annual', description: 'Enterprise Cloud License (100 seats)', rate: '$1,000 / seat / yr', total: '$100,000.00' },
    { type: 'Recurring Monthly', description: '24/7 Dedicated Support', rate: '$1,666.67 / mo', total: '$20,000.00' },
    { type: 'One-Time Fee', description: 'Onboarding & Migration Services', rate: '$5,000.00 Flat', total: '$5,000.00' },
    { type: 'Proration Adjustment', description: 'Mid-term seat expansion credit (14 days)', rate: 'Prorated', total: '-$4,602.74' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
              Screen 10 — Contract Billing & Proration Breakdown ({contract.id})
            </h1>
            <Badge status={contract.status} />
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Detailed line-item recurring schedules, one-time fees, and proration logic</p>
        </div>
        <button
          onClick={() => navigate('/invoices')}
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
          View Associated Invoices →
        </button>
      </div>

      {/* Contract Metadata */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Account Customer</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginTop: '4px' }}>{contract.customer}</div>
        </div>
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Contract Term</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1', marginTop: '4px' }}>{contract.startDate} — {contract.endDate}</div>
        </div>
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Annual Recurring Revenue (ARR)</div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#34d399', marginTop: '4px' }}>{contract.arr}</div>
        </div>
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Proration Credit Applied</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#fbbf24', marginTop: '4px' }}>{contract.proratedCredit}</div>
        </div>
      </div>

      {/* Billing Schedule Table */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginTop: 0, marginBottom: '16px' }}>Billing Line Item Schedule</h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '10px' }}>Charge Type</th>
              <th style={{ padding: '10px' }}>Description</th>
              <th style={{ padding: '10px' }}>Rate & Terms</th>
              <th style={{ padding: '10px' }}>Net Billed Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #0f172a' }}>
                <td style={{ padding: '12px 10px', color: '#38bdf8', fontWeight: '600' }}>{item.type}</td>
                <td style={{ padding: '12px 10px', color: '#f8fafc' }}>{item.description}</td>
                <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>{item.rate}</td>
                <td style={{ padding: '12px 10px', color: item.total.startsWith('-') ? '#f87171' : '#34d399', fontWeight: '700' }}>{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <ActionButtonRow
          secondary={{ label: 'Export Billing Schedule PDF', onClick: () => alert('Billing PDF exported!') }}
          primary={{ label: 'Generate Next Invoice', onClick: () => navigate('/invoices/INV-1092') }}
        />
      </div>
    </div>
  );
};

export default BillingDetail;
