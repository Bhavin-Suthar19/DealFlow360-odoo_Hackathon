/**
 * Warehouse Fulfillment Split Algorithm (Pure Function)
 *
 * Given a list of order items and warehouse stocks:
 * 1. Calculate available stock per warehouse: (qty_in_stock - qty_reserved)
 * 2. Sort warehouses by shipping_weight (ascending cost/distance penalty)
 * 3. Allocate line quantities to minimize total shipments while prioritizing lowest shipping weight.
 * 4. Any unfulfilled quantity creates a backorder record.
 */

export const calculateWarehouseSplit = (orderLines = [], warehousesStock = [], warehouses = []) => {
  const warehouseMap = new Map();
  warehouses.forEach((w) => {
    warehouseMap.set(w._id || w.id, {
      id: w._id || w.id,
      name: w.name,
      shipping_weight: Number(w.shipping_weight || 1.0)
    });
  });

  // Sort warehouses by shipping weight
  const sortedWarehouseIds = Array.from(warehouseMap.values())
    .sort((a, b) => a.shipping_weight - b.shipping_weight)
    .map((w) => w.id);

  // Available stock lookup: warehouse_id:product_id -> qty_available
  const stockLookup = new Map();
  warehousesStock.forEach((st) => {
    const whId = String(st.warehouse_id);
    const prId = String(st.product_id);
    const avail = Math.max(0, Number(st.qty_in_stock || 0) - Number(st.qty_reserved || 0));
    stockLookup.set(`${whId}:${prId}`, avail);
  });

  const splits = [];
  const backorders = [];

  orderLines.forEach((line) => {
    const productId = String(line.product_id);
    let remainingQty = Number(line.qty || 1);

    for (const whId of sortedWarehouseIds) {
      if (remainingQty <= 0) break;
      const key = `${whId}:${productId}`;
      const avail = stockLookup.get(key) || 0;

      if (avail > 0) {
        const qtyToTake = Math.min(remainingQty, avail);
        const whInfo = warehouseMap.get(whId);

        splits.push({
          warehouse_id: whId,
          product_id: productId,
          qty_fulfilled: qtyToTake,
          estimated_shipments: 1,
          cost: Number((qtyToTake * (whInfo ? whInfo.shipping_weight : 1.0)).toFixed(2))
        });

        // Deduct allocated stock locally
        stockLookup.set(key, avail - qtyToTake);
        remainingQty -= qtyToTake;
      }
    }

    if (remainingQty > 0) {
      backorders.push({
        product_id: productId,
        qty_pending: remainingQty,
        resolved: false
      });
    }
  });

  let status = 'Fulfilled';
  if (backorders.length > 0) {
    status = 'Backorder';
  } else if (splits.length > 1) {
    status = 'Split Pending';
  }

  return { splits, backorders, status };
};

export default calculateWarehouseSplit;
