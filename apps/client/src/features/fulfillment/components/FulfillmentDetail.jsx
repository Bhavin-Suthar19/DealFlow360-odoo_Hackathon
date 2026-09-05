import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CalloutBanner from '../../../components/CalloutBanner';
import ActionButtonRow from '../../../components/ActionButtonRow';
import Badge from '../../../components/Badge';

export const FulfillmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBackorderBanner, setShowBackorderBanner] = useState(true);

  const [allocation, setAllocation] = useState([
    { warehouse: 'US-East (Virginia)', available: 120, allocated: 70 },
    { warehouse: 'EU-Central (Frankfurt)', available: 80, allocated: 30 },
  ]);

  const totalRequired = 100;
  const totalAllocated = allocation.reduce((acc, curr) => acc + curr.allocated, 0);

  const handleAcceptSplit = () => {
    alert(`Fulfillment order ${id || 'ORD-8801'} released successfully! Proceeding to Subscriptions.`);
    navigate('/subscriptions');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
              Screen 8 — Warehouse Allocation Detail ({id || 'ORD-8801'})
            </h1>
            <Badge status="PENDING">Multi-Warehouse Allocation</Badge>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Manage stock splits, backorder consolidation, and shipping release</p>
        </div>
      </div>

      {/* Dismissible Backorder Notification Banner (Design Brief requirement) */}
      {showBackorderBanner && (
        <CalloutBanner
          type="info"
          title="Consolidate Remaining Backorder"
          message="Notice: US-West currently has 5 backordered units for Acme Corp. Would you like to consolidate those units into this US-East release batch to save 12% freight shipping costs?"
          actionLabel="Consolidate Now"
          onAction={() => alert('Backorder consolidated into batch!')}
          dismissible={true}
          onDismiss={() => setShowBackorderBanner(false)}
        />
      )}

      {/* Allocation Details */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '16px' }}>Order Item: Enterprise Cloud License (100 Total Units Required)</h2>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
              <th style={{ padding: '10px' }}>Warehouse Facility</th>
              <th style={{ padding: '10px' }}>Stock Available</th>
              <th style={{ padding: '10px' }}>Allocated Units</th>
              <th style={{ padding: '10px' }}>Split Status</th>
            </tr>
          </thead>
          <tbody>
            {allocation.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #0f172a' }}>
                <td style={{ padding: '12px 10px', color: '#f8fafc', fontWeight: '600' }}>{item.warehouse}</td>
                <td style={{ padding: '12px 10px', color: '#34d399' }}>{item.available} units</td>
                <td style={{ padding: '12px 10px' }}>
                  <input
                    type="number"
                    value={item.allocated}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      const copy = [...allocation];
                      copy[idx].allocated = val;
                      setAllocation(copy);
                    }}
                    style={{
                      width: '80px',
                      padding: '6px 8px',
                      borderRadius: '4px',
                      border: '1px solid #334155',
                      backgroundColor: '#0f172a',
                      color: '#fff',
                      fontWeight: '700',
                    }}
                  />
                </td>
                <td style={{ padding: '12px 10px' }}>
                  <Badge status="LOW">{((item.allocated / totalRequired) * 100).toFixed(0)}% Split</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
          <span style={{ fontSize: '14px', color: '#cbd5e1' }}>Total Allocated: <strong style={{ color: totalAllocated === totalRequired ? '#34d399' : '#f87171' }}>{totalAllocated} / {totalRequired} units</strong></span>
          {totalAllocated === totalRequired && <span style={{ fontSize: '13px', color: '#34d399', fontWeight: '600' }}>✓ Full Allocation Complete</span>}
        </div>

        <ActionButtonRow
          primary={{ label: 'Accept Warehouse Split & Release Order', onClick: handleAcceptSplit, disabled: totalAllocated !== totalRequired }}
          secondary={{ label: 'Manual Override Split', onClick: () => alert('Manual override mode activated.') }}
        />
      </div>
    </div>
  );
};

export default FulfillmentDetail;
