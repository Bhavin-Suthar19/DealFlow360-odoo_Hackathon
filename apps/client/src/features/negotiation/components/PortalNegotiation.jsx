import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CalloutBanner from '../../../components/CalloutBanner';
import ActionButtonRow from '../../../components/ActionButtonRow';
import Badge from '../../../components/Badge';

export const PortalNegotiation = () => {
  const navigate = useNavigate();

  const [counterDiscount, setCounterDiscount] = useState(20);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { author: 'John Sales (Account Rep)', time: 'Yesterday 4:30 PM', text: 'We have offered our standard Enterprise Tier discount of 18% for 100 seats.' },
    { author: 'You (Procurement Lead)', time: 'Today 9:15 AM', text: 'We need 20% discount to fit within our Q4 budget ceiling of $135,000.' },
  ]);

  const listPrice = 1000;
  const qty = 100;
  const netAmount = qty * listPrice * (1 - counterDiscount / 100);

  // Policy threshold ceiling is 15%
  const thresholdExceeded = counterDiscount > 15;

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments([...comments, { author: 'You (Procurement Lead)', time: 'Just now', text: commentText }]);
    setCommentText('');
  };

  const handleSubmitCounterOffer = () => {
    if (thresholdExceeded) {
      alert('Your counter-offer of 20% discount has been submitted. Because it exceeds standard automatic limits, your account rep and sales management have been notified for fast-track approval.');
    } else {
      alert('Your counter-offer has been accepted!');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
              Screen 11 — Quotation Negotiation Portal (QT-9021)
            </h1>
            <Badge status="NEGOTIATION">In Active Negotiation</Badge>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Review line items, propose custom counter-offer terms, and converse with your account manager</p>
        </div>
      </div>

      {thresholdExceeded && (
        <CalloutBanner
          type="warning"
          title="Automatic Escalation Notice"
          message="Submitting a 20% counter-offer exceeds standard sales rep authority (15%). Your proposal will trigger automatic fast-track review by Sales Management & Finance."
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '24px' }}>
        {/* Left Column: Quotation Review & Counter Proposal */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#10b981', marginBottom: '16px' }}>Proposed Quotation Terms</h2>

          <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '16px', marginBottom: '20px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '16px' }}>Enterprise Cloud License</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>100 Seats × $1,000 / seat list price</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#10b981' }}>${netAmount.toLocaleString()}</div>
                <div style={{ fontSize: '12px', color: '#fbbf24' }}>{counterDiscount}% Requested Discount</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #334155', paddingTop: '12px', marginTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '8px', fontWeight: '600' }}>
                Adjust Counter-Offer Discount (%):
              </label>
              <input
                type="range"
                min="0"
                max="30"
                value={counterDiscount}
                onChange={(e) => setCounterDiscount(parseFloat(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                <span>0% (List Price)</span>
                <span>15% (Standard Limit)</span>
                <span>30% (Max Request)</span>
              </div>
            </div>
          </div>

          <ActionButtonRow
            primary={{ label: 'Submit Counter-Offer Proposal', onClick: handleSubmitCounterOffer }}
            secondary={{ label: 'Accept Current Terms ($145,000)', onClick: () => alert('Terms accepted! Order generated.') }}
          />
        </div>

        {/* Right Column: Lightweight Conversation Thread */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginTop: 0, marginBottom: '16px' }}>
            💬 Negotiation Conversation Thread
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '360px', overflowY: 'auto', marginBottom: '16px', paddingRight: '4px' }}>
            {comments.map((c, idx) => {
              const isMe = c.author.startsWith('You');
              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    backgroundColor: isMe ? '#065f46' : '#1e293b',
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${isMe ? '#047857' : '#334155'}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '700', color: isMe ? '#6ee7b7' : '#38bdf8' }}>{c.author}</span>
                    <span>{c.time}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#f8fafc', lineHeight: '1.4' }}>{c.text}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Type message or justification..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #334155',
                backgroundColor: '#1e293b',
                color: '#fff',
                fontSize: '13px',
              }}
            />
            <button
              onClick={handleAddComment}
              style={{
                padding: '10px 16px',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalNegotiation;
