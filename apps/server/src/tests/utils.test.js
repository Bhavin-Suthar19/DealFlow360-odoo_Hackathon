import assert from 'assert';
import { calculateBlendedRiskScore } from '../utils/riskScore.util.js';
import { calculateWarehouseSplit } from '../utils/warehouseSplit.util.js';
import { calculateProration } from '../utils/proration.util.js';

console.log('--- Running Pure Utility Integration Tests ---');

// Test 1: Risk Score Utility
{
  const lines = [
    { qty: 2, unit_price: 100, discount_pct: 20, discount_limit_pct: 10 }, // 10% overage, weight 200
    { qty: 1, unit_price: 100, discount_pct: 5, discount_limit_pct: 10 }    // 0% overage, weight 100
  ];
  // total weight = 300, weighted overage = 20 * 10 = 2000 / 300 = 6.67%
  const result = calculateBlendedRiskScore(lines);
  assert.strictEqual(result.blended_risk_score, 6.67);
  assert.strictEqual(result.risk_level, 'medium');
  console.log('✓ Risk Score Utility Test Passed:', result);
}

// Test 2: Warehouse Split Utility
{
  const lines = [{ product_id: 'p1', qty: 10 }];
  const warehouses = [
    { _id: 'w1', name: 'West Warehouse', shipping_weight: 1.0 },
    { _id: 'w2', name: 'East Warehouse', shipping_weight: 2.0 }
  ];
  const stocks = [
    { warehouse_id: 'w1', product_id: 'p1', qty_in_stock: 6, qty_reserved: 0 },
    { warehouse_id: 'w2', product_id: 'p1', qty_in_stock: 10, qty_reserved: 0 }
  ];

  const result = calculateWarehouseSplit(lines, stocks, warehouses);
  assert.strictEqual(result.splits.length, 2);
  assert.strictEqual(result.splits[0].qty_fulfilled, 6);
  assert.strictEqual(result.splits[1].qty_fulfilled, 4);
  assert.strictEqual(result.status, 'Split Pending');
  console.log('✓ Warehouse Split Utility Test Passed:', result.status);
}

// Test 3: Proration Utility
{
  const result = calculateProration({
    cycle: 'monthly',
    changeDate: new Date('2026-09-15'),
    cycleStartDate: new Date('2026-09-01'),
    oldQty: 1,
    newQty: 0,
    unitPrice: 300
  });

  assert(result.proratedAmount < 0, 'Prorated amount should be negative for cancellation');
  console.log('✓ Proration Utility Test Passed:', result);
}

console.log('✓ All Utility Integration Tests Passed Cleanly!');
