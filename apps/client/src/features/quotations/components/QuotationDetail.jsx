import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CalloutBanner from '../../../components/CalloutBanner';
import ActionButtonRow from '../../../components/ActionButtonRow';
import Badge from '../../../components/Badge';

export const QuotationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lineItems, setLineItems] = useState([
    { id: 1, name: 'Enterprise Cloud License', sku: 'SKU-CL01', qty: 100, price: 1000, discount: 18, maxDiscount: 15 },
    { id: 2, name: 'Premium Support 24/7', sku: 'SKU-SUP02', qty: 1, price: 25001, discount: 5, maxDiscount: 10 },
  ]);

  const [customer, setCustomer] = useState('Acme Corp');

  // Check if any line exceeds tier ceiling
  const flaggedItems = lineItems.filter((item) => item.discount > item.maxDiscount);
  const isOverLimit = flaggedItems.length > 0;

  const handleDiscountChange = (itemId, val) => {
    const num = parseFloat(val) || 0;
    setLineItems(lineItems.map((item) => (item.id === itemId ? { ...item, discount: num } : item)));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((acc, item) => {
      const lineTotal = item.qty * item.price * (1 - item.discount / 100);
      return acc + lineTotal;
    }, 0);
  };

  const handleSubmitQuote = () => {
    if (isOverLimit) {
      // Auto-escalates to Approval Chain (Screen 6)
      navigate(`/approvals/AP-${id || '9021'}`);
    } else {
      // Clean approval, forward to Fulfillment (Screen 7)
      navigate('/fulfillment');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
              Screen 4 — Quotation Builder ({id || 'QT-9021'})
            </h1>
            <Badge status={isOverLimit ? 'HIGH' : 'LOW'}>{isOverLimit ? 'Approval Flagged' : 'Valid'}</Badge>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Configure pricing, live discount validation, and cross-sell engine</p>
        </div>
      </div>

      {isOverLimit && (
        <CalloutBanner
          type="warning"
          title="Governance Warning: Line-Item Ceiling Exceeded"
          message={`Line item "${flaggedItems[0].name}" has a ${flaggedItems[0].discount}% discount, which exceeds the Tier ceiling limit of ${flaggedItems[0].maxDiscount}%. Submitting will auto-escalate to Sales Manager & Finance approval.`}
          actionLabel="View Approval Rules"
          onAction={() => navigate('/governance')}
        />
      )}

      {/* Main Layout: Cart + Side Upsell Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
        {/* Left Column: Cart & Lines */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '16px' }}>Line Item Pricing & Discount Matrix</h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                  <th style={{ padding: '10px' }}>Product SKU</th>
                  <th style={{ padding: '10px' }}>Qty</th>
                  <th style={{ padding: '10px' }}>List Price</th>
                  <th style={{ padding: '10px' }}>Discount %</th>
                  <th style={{ padding: '10px' }}>Net Price</th>
                  <th style={{ padding: '10px' }}>Tier Status</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => {
                  const netPrice = item.qty * item.price * (1 - item.discount / 100);
                  const isFlagged = item.discount > item.maxDiscount;

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #0f172a' }}>
                      <td style={{ padding: '12px 10px', color: '#f8fafc', fontWeight: '600' }}>
                        {item.name}
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{item.sku}</div>
                      </td>
                      <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>{item.qty}</td>
                      <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>${item.price.toLocaleString()}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) => handleDiscountChange(item.id, e.target.value)}
                          style={{
                            width: '70px',
                            padding: '6px 8px',
                            borderRadius: '4px',
                            border: `1px solid ${isFlagged ? '#ef4444' : '#334155'}`,
                            backgroundColor: '#0f172a',
                            color: isFlagged ? '#f87171' : '#fff',
                            fontWeight: '700',
                          }}
                        />
                      </td>
                      <td style={{ padding: '12px 10px', color: '#34d399', fontWeight: '700' }}>${netPrice.toLocaleString()}</td>
                      <td style={{ padding: '12px 10px' }}>
                        <Badge status={isFlagged ? 'HIGH' : 'APPROVED'}>
                          {isFlagged ? `Over ${item.maxDiscount}% Limit` : `Within ${item.maxDiscount}% Limit`}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ textAlignment: 'right', backgroundColor: '#0f172a', padding: '16px 24px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>Total Quoted Deal Value</div>
              <div style={{ fontSize: '28px', fontWeight: '800', color: '#38bdf8' }}>${calculateSubtotal().toLocaleString()}</div>
            </div>
          </div>

          <ActionButtonRow
            primary={{
              label: isOverLimit ? 'Submit for Approval (Auto-Flagged)' : 'Confirm & Send to Fulfillment',
              onClick: handleSubmitQuote,
            }}
            secondary={{
              label: 'Save Draft',
              onClick: () => navigate('/quotations'),
            }}
          />
        </div>

        {/* Right Column: Live Upsell Suggestions Panel */}
        <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#38bdf8', marginTop: 0, marginBottom: '12px' }}>
            💡 Live AI Upsell Suggestions
          </h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>Based on Acme Corp's account history & deal size</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ fontWeight: '600', fontSize: '13px', color: '#f8fafc' }}>Dedicated TAM Support Package</div>
              <div style={{ fontSize: '12px', color: '#34d399', margin: '4px 0' }}>+$12,000 / yr (High margin)</div>
              <button
                onClick={() =>
                  setLineItems([
                    ...lineItems,
                    { id: Date.now(), name: 'Dedicated TAM Support Package', sku: 'SKU-TAM', qty: 1, price: 12000, discount: 0, maxDiscount: 10 },
                  ])
                }
                style={{
                  marginTop: '6px',
                  width: '100%',
                  padding: '6px',
                  backgroundColor: '#0369a1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                + Add to Quote
              </button>
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ fontWeight: '600', fontSize: '13px', color: '#f8fafc' }}>Multi-Region Disaster Recovery Add-on</div>
              <div style={{ fontSize: '12px', color: '#34d399', margin: '4px 0' }}>+$18,500 / yr</div>
              <button
                onClick={() =>
                  setLineItems([
                    ...lineItems,
                    { id: Date.now(), name: 'Multi-Region DR Add-on', sku: 'SKU-DR', qty: 1, price: 18500, discount: 0, maxDiscount: 10 },
                  ])
                }
                style={{
                  marginTop: '6px',
                  width: '100%',
                  padding: '6px',
                  backgroundColor: '#0369a1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                + Add to Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetail;
