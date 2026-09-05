import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';

export const QuotationsList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('kanban');

  const quotes = [
    { id: 'QT-9021', customer: 'Acme Corp', amount: '$145,000', stage: 'Negotiation', discount: '18%', risk: 'HIGH' },
    { id: 'QT-9022', customer: 'TechStart Inc', amount: '$42,000', stage: 'Pending', discount: '8%', risk: 'MEDIUM' },
    { id: 'QT-9023', customer: 'Global Logistics', amount: '$210,000', stage: 'Approved', discount: '5%', risk: 'LOW' },
    { id: 'QT-9024', customer: 'Nexus Health', amount: '$88,500', stage: 'Draft', discount: '0%', risk: 'LOW' },
    { id: 'QT-9025', customer: 'Apex Dynamics', amount: '$320,000', stage: 'Confirmed', discount: '12%', risk: 'LOW' },
  ];

  const stages = ['Draft', 'Pending', 'Approved', 'Negotiation', 'Confirmed'];

  const columns = [
    { header: 'Quote ID', accessor: 'id', render: (r) => <span style={{ fontWeight: '700', color: '#38bdf8' }}>{r.id}</span> },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Discount', accessor: 'discount' },
    { header: 'Stage', accessor: 'stage', render: (r) => <Badge status={r.stage} /> },
    { header: 'Governance Risk', accessor: 'risk', render: (r) => <Badge status={r.risk} /> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>Screen 3 — Quotations Management</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Kanban and ledger view of deal flow by governance stage</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'inline-flex', backgroundColor: '#1e293b', padding: '4px', borderRadius: '8px', border: '1px solid #334155' }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                padding: '6px 14px',
                backgroundColor: viewMode === 'kanban' ? '#0284c7' : 'transparent',
                color: viewMode === 'kanban' ? '#fff' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Kanban View
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 14px',
                backgroundColor: viewMode === 'table' ? '#0284c7' : 'transparent',
                color: viewMode === 'table' ? '#fff' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Table View
            </button>
          </div>

          <button
            onClick={() => navigate('/quotations/new')}
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
            + New Quotation
          </button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
          {stages.map((stage) => {
            const stageQuotes = quotes.filter((q) => q.stage.toLowerCase() === stage.toLowerCase());

            return (
              <div key={stage} style={{ backgroundColor: '#1e293b', borderRadius: '10px', padding: '16px', border: '1px solid #334155', minWidth: '220px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #334155' }}>
                  <span style={{ fontWeight: '700', fontSize: '14px', color: '#f8fafc' }}>{stage}</span>
                  <span style={{ backgroundColor: '#0f172a', color: '#94a3b8', fontSize: '12px', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
                    {stageQuotes.length}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stageQuotes.map((q) => (
                    <div
                      key={q.id}
                      onClick={() => navigate(`/quotations/${q.id}`)}
                      style={{
                        backgroundColor: '#0f172a',
                        borderRadius: '8px',
                        padding: '14px',
                        border: '1px solid #334155',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease, border-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0284c7';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#334155';
                        e.currentTarget.style.transform = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8' }}>{q.id}</span>
                        <Badge status={q.risk} />
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#f8fafc', marginBottom: '4px' }}>{q.customer}</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#34d399' }}>{q.amount}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>Discount: {q.discount}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <DataTable columns={columns} data={quotes} onRowClick={(row) => navigate(`/quotations/${row.id}`)} />
      )}
    </div>
  );
};

export default QuotationsList;
