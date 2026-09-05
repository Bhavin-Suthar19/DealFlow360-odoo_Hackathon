import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/DataTable';
import Badge from '../../../components/Badge';

export const ProductCatalog = () => {
  const navigate = useNavigate();

  const products = [
    { id: 'PROD-101', sku: 'SKU-CL01', name: 'Enterprise Cloud License', category: 'Software / SaaS', price: '$1,000 / seat / yr', maxDiscount: '15% Ceiling', status: 'ACTIVE' },
    { id: 'PROD-102', sku: 'SKU-SUP02', name: '24/7 Premium Support Package', category: 'Services', price: '$25,000 / yr', maxDiscount: '10% Ceiling', status: 'ACTIVE' },
    { id: 'PROD-103', sku: 'SKU-DR03', name: 'Multi-Region DR Add-on', category: 'Infrastructure', price: '$18,500 / yr', maxDiscount: '12% Ceiling', status: 'ACTIVE' },
  ];

  const columns = [
    { header: 'Product ID', accessor: 'id', render: (r) => <span style={{ fontWeight: '700', color: '#38bdf8' }}>{r.id}</span> },
    { header: 'SKU', accessor: 'sku' },
    { header: 'Product Name', accessor: 'name', render: (r) => <span style={{ fontWeight: '600', color: '#f8fafc' }}>{r.name}</span> },
    { header: 'Category', accessor: 'category' },
    { header: 'List Price', accessor: 'price', render: (r) => <span style={{ fontWeight: '700', color: '#34d399' }}>{r.price}</span> },
    { header: 'Discount Ceiling', accessor: 'maxDiscount', render: (r) => <Badge status="MEDIUM">{r.maxDiscount}</Badge> },
    { header: 'Status', accessor: 'status', render: (r) => <Badge status={r.status} /> },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>Screen 16 — Product & Pricing Catalog</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Master product catalog, SKU definitions, and category discount ceilings</p>
        </div>
        <button
          onClick={() => navigate('/products/new')}
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
          + Add New Product SKU
        </button>
      </div>

      <DataTable columns={columns} data={products} onRowClick={(r) => navigate(`/products/${r.id}`)} />
    </div>
  );
};

export default ProductCatalog;
