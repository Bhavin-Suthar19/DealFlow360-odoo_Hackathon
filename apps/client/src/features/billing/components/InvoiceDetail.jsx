import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HorizontalStepper from '../../../components/HorizontalStepper';
import ActionButtonRow from '../../../components/ActionButtonRow';
import Badge from '../../../components/Badge';

export const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('UNPAID');

  const lifecycleSteps = [
    { label: 'Order Confirmed' },
    { label: 'Goods Shipped' },
    { label: 'Invoice Issued' },
    { label: status === 'PAID' ? 'Paid in Full' : 'Payment Pending' },
  ];

  const handleRecordPayment = () => {
    setStatus('PAID');
    alert(`Payment of $145,000.00 successfully recorded for Invoice ${id || 'INV-1092'}!`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
              Screen 13 — Invoice Lifecycle & Record Payment ({id || 'INV-1092'})
            </h1>
            <Badge status={status} />
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Invoice breakdown, lifecycle tracking, and payment recording</p>
        </div>
      </div>

      {/* Invoice Lifecycle Stepper */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', color: '#94a3b8', marginTop: 0, marginBottom: '8px' }}>Invoice Lifecycle Stepper</h3>
        <HorizontalStepper steps={lifecycleSteps} currentStepIndex={status === 'PAID' ? 3 : 2} />
      </div>

      {/* Invoice Details */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginTop: 0, marginBottom: '16px' }}>Invoice Line Breakdown — Acme Corp</h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '10px' }}>Line Item</th>
              <th style={{ padding: '10px' }}>Quantity</th>
              <th style={{ padding: '10px' }}>Unit Price</th>
              <th style={{ padding: '10px' }}>Amount Billed</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #0f172a' }}>
              <td style={{ padding: '12px 10px', color: '#f8fafc', fontWeight: '600' }}>Enterprise Cloud License (Annual)</td>
              <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>100</td>
              <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>$1,000.00</td>
              <td style={{ padding: '12px 10px', color: '#34d399', fontWeight: '700' }}>$100,000.00</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #0f172a' }}>
              <td style={{ padding: '12px 10px', color: '#f8fafc', fontWeight: '600' }}>24/7 Dedicated Support</td>
              <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>1</td>
              <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>$45,000.00</td>
              <td style={{ padding: '12px 10px', color: '#34d399', fontWeight: '700' }}>$45,000.00</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ textAlignment: 'right', backgroundColor: '#0f172a', padding: '16px 24px', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>Total Invoice Amount Due</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: status === 'PAID' ? '#34d399' : '#38bdf8' }}>
              $145,000.00 {status === 'PAID' && '(PAID)'}
            </div>
          </div>
        </div>

        <ActionButtonRow
          primary={{
            label: status === 'PAID' ? '✓ Invoice Paid in Full' : 'Record Payment Received ($145,000)',
            onClick: handleRecordPayment,
            disabled: status === 'PAID',
          }}
          secondary={{
            label: 'Download Invoice PDF',
            onClick: () => alert('Downloading PDF...'),
          }}
        />
      </div>
    </div>
  );
};

export default InvoiceDetail;
