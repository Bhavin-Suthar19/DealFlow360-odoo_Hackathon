import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ActionButtonRow from '../../../components/ActionButtonRow';
import Badge from '../../../components/Badge';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('Enterprise Cloud License');
  const [sku, setSku] = useState('SKU-CL01');
  const [price, setPrice] = useState(1000);
  const [category, setCategory] = useState('Software / SaaS');
  const [maxDiscount, setMaxDiscount] = useState(15);

  const handleSave = () => {
    alert(`Product SKU ${sku} configuration saved successfully!`);
    navigate('/products');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: '#f8fafc' }}>
              Screen 17 — Product SKU & Pricing Configuration ({id || 'PROD-101'})
            </h1>
            <Badge status="ACTIVE" />
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>Configure list prices, category discount ceilings, and subscription billing variants</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '24px', maxWidth: '800px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '20px' }}>Product & Pricing Rules</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>SKU Code</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>List Price ($ / unit)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
            >
              <option>Software / SaaS</option>
              <option>Services</option>
              <option>Infrastructure</option>
              <option>Hardware</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Max Discount Ceiling (%)</label>
            <input
              type="number"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(parseFloat(e.target.value))}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <ActionButtonRow
          primary={{ label: 'Save SKU Configuration', onClick: handleSave }}
          secondary={{ label: 'Cancel', onClick: () => navigate('/products') }}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
