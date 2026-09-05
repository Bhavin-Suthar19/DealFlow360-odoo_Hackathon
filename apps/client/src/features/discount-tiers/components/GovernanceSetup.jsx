import React from 'react';
import ActionButtonRow from '../../../components/ActionButtonRow';
import Badge from '../../../components/Badge';

export const GovernanceSetup = () => {
  const discountTiers = [
    { tier: 'Tier 1 (Standard Sales Rep)', maxDiscount: '5.0%', marginFloor: '25.0%', approvalRequired: 'Auto-Approved' },
    { tier: 'Tier 2 (Senior Rep Authority)', maxDiscount: '10.0%', marginFloor: '20.0%', approvalRequired: 'Auto-Approved' },
    { tier: 'Tier 3 (Sales Manager Sign-off)', maxDiscount: '15.0%', marginFloor: '15.0%', approvalRequired: 'Sales Manager' },
    { tier: 'Tier 4 (VP & Finance Escalation)', maxDiscount: '25.0%', marginFloor: '10.0%', approvalRequired: 'Finance + VP Sales' },
  ];

  const categoryCeilings = [
    { category: 'Software / SaaS', maxCeiling: '15.0%', approvalChain: 'Sales Manager' },
    { category: 'Professional Services', maxCeiling: '10.0%', approvalChain: 'VP Services' },
    { category: 'Hardware Units', maxCeiling: '5.0%', approvalChain: 'Finance Director' },
  ];

  const handleSaveGovernance = () => {
    alert('Governance Matrix & Discount Tier rules updated successfully!');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
            Screen 18 — Governance Engine & Discount Matrix Setup
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Admin setup for multi-tier discount ceilings, category caps, and auto-escalation matrix</p>
        </div>
      </div>

      {/* Grid Matrix 1: Tier Discount Ceilings */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '16px' }}>📊 Tier Discount Ceiling Matrix</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '10px' }}>Governance Tier Level</th>
              <th style={{ padding: '10px' }}>Discount Ceiling (%)</th>
              <th style={{ padding: '10px' }}>Margin Floor (%)</th>
              <th style={{ padding: '10px' }}>Escalation Trigger</th>
            </tr>
          </thead>
          <tbody>
            {discountTiers.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #0f172a' }}>
                <td style={{ padding: '12px 10px', color: '#f8fafc', fontWeight: '600' }}>{row.tier}</td>
                <td style={{ padding: '12px 10px', color: '#38bdf8', fontWeight: '700' }}>{row.maxDiscount}</td>
                <td style={{ padding: '12px 10px', color: '#34d399', fontWeight: '700' }}>{row.marginFloor}</td>
                <td style={{ padding: '12px 10px' }}>
                  <Badge status={row.approvalRequired === 'Auto-Approved' ? 'LOW' : 'HIGH'}>{row.approvalRequired}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Grid Matrix 2: Category Ceilings */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '16px' }}>🏷️ Category Ceiling Caps</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '10px' }}>Product Category</th>
              <th style={{ padding: '10px' }}>Max Category Ceiling</th>
              <th style={{ padding: '10px' }}>Required Approval Node</th>
            </tr>
          </thead>
          <tbody>
            {categoryCeilings.map((cat, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #0f172a' }}>
                <td style={{ padding: '12px 10px', color: '#f8fafc', fontWeight: '600' }}>{cat.category}</td>
                <td style={{ padding: '12px 10px', color: '#fbbf24', fontWeight: '700' }}>{cat.maxCeiling}</td>
                <td style={{ padding: '12px 10px' }}>
                  <Badge status="MEDIUM">{cat.approvalChain}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ActionButtonRow primary={{ label: 'Save Governance Rules & Matrix', onClick: handleSaveGovernance }} />
      </div>
    </div>
  );
};

export default GovernanceSetup;
