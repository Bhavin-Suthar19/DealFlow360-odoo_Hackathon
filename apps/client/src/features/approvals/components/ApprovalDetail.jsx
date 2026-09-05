import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HorizontalStepper from '../../../components/HorizontalStepper';
import CalloutBanner from '../../../components/CalloutBanner';
import ActionButtonRow from '../../../components/ActionButtonRow';
import Badge from '../../../components/Badge';

export const ApprovalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');

  const steps = [
    { label: 'Submitted (Rep)' },
    { label: 'Sales Manager (In Review)' },
    { label: 'Finance Review' },
    { label: 'VP Sales Sign-off' },
    { label: 'Confirmed' },
  ];

  const flaggedBreakdown = [
    { rule: 'Product Line-Item Ceiling', item: 'Enterprise Cloud License', value: '18% Discount', limit: '15% Ceiling', severity: 'HIGH' },
    { rule: 'Blended Margin Threshold', item: 'Overall Deal', value: '11.4% Margin', limit: '12% Minimum', severity: 'MEDIUM' },
  ];

  const auditLog = [
    { time: 'Today 10:14 AM', user: 'System Governance', event: 'Auto-flagged deal QT-9021 due to 18% discount on Enterprise Cloud License' },
    { time: 'Today 10:15 AM', user: 'John Sales (Rep)', event: 'Submitted deal with comment: "Competitive pressure against Competitor X"' },
  ];

  const handleApprove = () => {
    alert(`Approval ${id || 'AP-9021'} granted! Proceeding to Fulfillment.`);
    navigate('/fulfillment');
  };

  const handleReturn = () => {
    alert(`Returned approval ${id || 'AP-9021'} back to Sales Rep for revision.`);
    navigate('/quotations/QT-9021');
  };

  const handleReject = () => {
    alert(`Approval ${id || 'AP-9021'} rejected.`);
    navigate('/approvals');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
              Screen 6 — Approval Governance Detail ({id || 'AP-9021'})
            </h1>
            <Badge status="HIGH">High Risk Escalation</Badge>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Review flagged policy violations, approval chain stepper, and audit history</p>
        </div>
      </div>

      {/* Horizontal Approval Chain Stepper */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '14px', color: '#94a3b8', marginTop: 0, marginBottom: '8px' }}>Approval Chain Progress</h3>
        <HorizontalStepper steps={steps} currentStepIndex={1} />
      </div>

      {/* Why This Quote Was Flagged */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '16px' }}>🚨 Policy Escalation Matrix ("Why Flagged")</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '10px' }}>Governance Rule</th>
              <th style={{ padding: '10px' }}>Affected Item</th>
              <th style={{ padding: '10px' }}>Submitted Value</th>
              <th style={{ padding: '10px' }}>Policy Limit</th>
              <th style={{ padding: '10px' }}>Severity</th>
            </tr>
          </thead>
          <tbody>
            {flaggedBreakdown.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #0f172a' }}>
                <td style={{ padding: '12px 10px', color: '#f8fafc', fontWeight: '600' }}>{row.rule}</td>
                <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>{row.item}</td>
                <td style={{ padding: '12px 10px', color: '#f87171', fontWeight: '700' }}>{row.value}</td>
                <td style={{ padding: '12px 10px', color: '#34d399' }}>{row.limit}</td>
                <td style={{ padding: '12px 10px' }}>
                  <Badge status={row.severity} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Manager Decision & Audit Trail */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Decision Form */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginTop: 0, marginBottom: '12px' }}>Approval Decision & Feedback</h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add mandatory justification or return instructions for rep..."
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #334155',
              backgroundColor: '#0f172a',
              color: '#fff',
              boxSizing: 'border-box',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          />

          <ActionButtonRow
            primary={{ label: 'Approve & Release Deal', onClick: handleApprove }}
            secondary={{ label: 'Return to Rep for Revision', onClick: handleReturn }}
            destructive={{ label: 'Reject Deal', onClick: handleReject }}
          />
        </div>

        {/* Audit Trail */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginTop: 0, marginBottom: '16px' }}>📜 Immutable Audit Log</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {auditLog.map((log, idx) => (
              <div key={idx} style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600', fontSize: '13px', color: '#38bdf8' }}>{log.user}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{log.time}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#cbd5e1' }}>{log.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalDetail;
