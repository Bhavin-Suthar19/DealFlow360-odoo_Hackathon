import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';

export const FulfillmentList = () => {
  const navigate = useNavigate();

  const stockInventory = [
    { warehouse: 'US-East (Virginia)', sku: 'SKU-CL01', name: 'Enterprise Cloud License', available: 120, allocated: 45 },
    { warehouse: 'US-West (California)', sku: 'SKU-CL01', name: 'Enterprise Cloud License', available: 35, allocated: 30 },
    { warehouse: 'EU-Central (Frankfurt)', sku: 'SKU-CL01', name: 'Enterprise Cloud License', available: 80, allocated: 20 },
  ];

  const pendingFulfillmentOrders = [
    { id: 'ORD-8801', quoteId: 'QT-9021', customer: 'Acme Corp', qty: 100, status: 'Awaiting Warehouse Allocation', splitRequired: true },
    { id: 'ORD-8802', quoteId: 'QT-9023', customer: 'Global Logistics', qty: 50, status: 'Ready for Release', splitRequired: false },
  ];

  const columns = [
    { header: 'Order ID', accessor: 'id', render: (r) => <span style={{ fontWeight: '700', color: '#38bdf8' }}>{r.id}</span> },
    { header: 'Quote Ref', accessor: 'quoteId' },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Total Qty', accessor: 'qty' },
    { header: 'Warehouse Split', accessor: 'splitRequired', render: (r) => <Badge status={r.splitRequired ? 'MEDIUM' : 'LOW'}>{r.splitRequired ? 'Multi-Warehouse Split' : 'Single Hub'}</Badge> },
    { header: 'Fulfillment Status', accessor: 'status', render: (r) => <Badge status={r.splitRequired ? 'PENDING' : 'APPROVED'}>{r.status}</Badge> },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>Screen 7 — Inventory & Fulfillment Release</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Multi-warehouse stock allocation and order release console</p>
      </div>

      {/* Warehouse Stock Grid */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginTop: 0, marginBottom: '16px' }}>📦 Live Warehouse Stock Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {stockInventory.map((item, idx) => (
            <div key={idx} style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#38bdf8' }}>{item.warehouse}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 12px 0' }}>{item.name} ({item.sku})</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#cbd5e1' }}>Available Stock: <strong style={{ color: '#34d399' }}>{item.available} units</strong></span>
                <span style={{ color: '#cbd5e1' }}>Allocated: <strong style={{ color: '#fbbf24' }}>{item.allocated} units</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginTop: 0, marginBottom: '16px' }}>Orders Awaiting Fulfillment Release</h3>
        <DataTable columns={columns} data={pendingFulfillmentOrders} onRowClick={(r) => navigate(`/fulfillment/${r.id}`)} />
      </div>
    </div>
  );
};

export default FulfillmentList;
