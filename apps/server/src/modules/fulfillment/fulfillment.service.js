import {
  FulfillmentOrder,
  FulfillmentSplit,
  Backorder,
  Quotation,
  QuotationLine,
  Warehouse,
  WarehouseStock
} from '../../models/index.js';
import { calculateWarehouseSplit } from '../../utils/warehouseSplit.util.js';
import { paginate } from '../../utils/paginate.util.js';

export class FulfillmentService {
  async getAll(query = {}) {
    const filter = {};
    if (query.status) filter.status = query.status;

    const result = await paginate(FulfillmentOrder, filter, {
      page: query.page,
      limit: query.limit,
      populate: [{ path: 'quotation_id', populate: { path: 'customer_id' } }]
    });

    const populatedOrders = await Promise.all(
      result.data.map(async (order) => {
        const orderObj = order.toObject ? order.toObject() : { ...order };
        let splits = await FulfillmentSplit.find({ fulfillment_order_id: order._id })
          .populate('warehouse_id product_id');

        // If no splits exist yet, auto-calculate and persist them
        if (splits.length === 0) {
          try {
            await this.calculateAndApplySuggestedSplit(order._id);
            splits = await FulfillmentSplit.find({ fulfillment_order_id: order._id })
              .populate('warehouse_id product_id');
          } catch (_) {}
        }

        orderObj.splits = splits.map((s) => ({
          ...s.toObject(),
          id: s._id,
          warehouse_name: s.warehouse_id?.name || 'Main Logistics Depot',
          product_name: s.product_id?.name || 'Catalog Product',
          qty_fulfilled: s.qty_fulfilled ?? 1,
          estimated_shipments: s.estimated_shipments ?? 1,
          cost: s.cost ?? 0
        }));

        const backorders = await Backorder.find({ fulfillment_order_id: order._id })
          .populate('product_id');
        orderObj.backorders = backorders.map((b) => (b.toObject ? b.toObject() : { ...b }));

        // Ensure customer_name and quote_number are readily accessible on top level
        orderObj.quote_number = orderObj.quote_number || orderObj.quotation_id?.quote_number || 'Confirmed Quote';
        orderObj.customer_name = orderObj.customer_name || orderObj.quotation_id?.customer_name || orderObj.quotation_id?.customer_id?.name || 'Enterprise Customer';

        return orderObj;
      })
    );

    return { ...result, data: populatedOrders };
  }

  async getById(id) {
    const order = await FulfillmentOrder.findById(id).populate({
      path: 'quotation_id',
      populate: { path: 'customer_id' }
    });
    if (!order) {
      const err = new Error('Fulfillment order not found');
      err.statusCode = 404;
      throw err;
    }
    let splits = await FulfillmentSplit.find({ fulfillment_order_id: id }).populate('warehouse_id product_id');
    if (splits.length === 0) {
      try {
        await this.calculateAndApplySuggestedSplit(id);
        splits = await FulfillmentSplit.find({ fulfillment_order_id: id }).populate('warehouse_id product_id');
      } catch (_) {}
    }

    const backorders = await Backorder.find({ fulfillment_order_id: id }).populate('product_id');

    const formattedSplits = splits.map((s) => ({
      ...s.toObject(),
      id: s._id,
      warehouse_name: s.warehouse_id?.name || 'Main Logistics Depot',
      product_name: s.product_id?.name || 'Catalog Product',
      qty_fulfilled: s.qty_fulfilled ?? 1,
      estimated_shipments: s.estimated_shipments ?? 1,
      cost: s.cost ?? 0
    }));

    const orderObj = order.toObject ? order.toObject() : { ...order };
    orderObj.splits = formattedSplits;
    orderObj.backorders = backorders;
    orderObj.quote_number = orderObj.quote_number || orderObj.quotation_id?.quote_number || 'Confirmed Quote';
    orderObj.customer_name = orderObj.customer_name || orderObj.quotation_id?.customer_name || orderObj.quotation_id?.customer_id?.name || 'Enterprise Customer';

    return { order: orderObj, splits: formattedSplits, backorders };
  }

  async createFulfillmentOrderForQuotation(quotationId) {
    const existing = await FulfillmentOrder.findOne({ quotation_id: quotationId });
    if (existing) return existing;

    const order = await FulfillmentOrder.create({
      quotation_id: quotationId,
      status: 'Split Pending'
    });

    // Auto-calculate suggested split
    await this.calculateAndApplySuggestedSplit(order._id);
    return order;
  }

  async calculateAndApplySuggestedSplit(fulfillmentOrderId) {
    const order = await FulfillmentOrder.findById(fulfillmentOrderId);
    if (!order) {
      const err = new Error('Fulfillment order not found');
      err.statusCode = 404;
      throw err;
    }

    const quotationLines = await QuotationLine.find({ quotation_id: order.quotation_id });
    const warehouses = await Warehouse.find();
    const stocks = await WarehouseStock.find();

    const { splits, backorders, status } = calculateWarehouseSplit(quotationLines, stocks, warehouses);

    // Save splits & backorders
    await FulfillmentSplit.deleteMany({ fulfillment_order_id: fulfillmentOrderId });
    await Backorder.deleteMany({ fulfillment_order_id: fulfillmentOrderId });

    const createdSplits = [];
    for (const s of splits) {
      const splitDoc = await FulfillmentSplit.create({
        fulfillment_order_id: fulfillmentOrderId,
        warehouse_id: s.warehouse_id,
        product_id: s.product_id,
        qty_fulfilled: s.qty_fulfilled,
        estimated_shipments: s.estimated_shipments,
        cost: s.cost
      });
      createdSplits.push(splitDoc);
    }

    const createdBackorders = [];
    for (const b of backorders) {
      const boDoc = await Backorder.create({
        fulfillment_order_id: fulfillmentOrderId,
        product_id: b.product_id,
        qty_pending: b.qty_pending,
        resolved: b.resolved
      });
      createdBackorders.push(boDoc);
    }

    order.status = status;
    await order.save();

    const populatedSplits = await FulfillmentSplit.find({ fulfillment_order_id: fulfillmentOrderId })
      .populate('warehouse_id product_id');

    const formattedSplits = populatedSplits.map((s) => ({
      ...s.toObject(),
      id: s._id,
      warehouse_name: s.warehouse_id?.name || 'Main Logistics Depot',
      product_name: s.product_id?.name || 'Catalog Product',
      qty_fulfilled: s.qty_fulfilled ?? 1,
      estimated_shipments: s.estimated_shipments ?? 1,
      cost: s.cost ?? 0
    }));

    return { order, splits: formattedSplits, backorders: createdBackorders };
  }

  async manualOverride(fulfillmentOrderId, allocations = []) {
    const order = await FulfillmentOrder.findById(fulfillmentOrderId);
    if (!order) {
      const err = new Error('Fulfillment order not found');
      err.statusCode = 404;
      throw err;
    }

    await FulfillmentSplit.deleteMany({ fulfillment_order_id: fulfillmentOrderId });

    for (const alloc of allocations) {
      const warehouseId = alloc.warehouse_id?._id || alloc.warehouse_id;
      const productId = alloc.product_id?._id || alloc.product_id;
      const warehouse = await Warehouse.findById(warehouseId);
      const qty = Number(alloc.qty_fulfilled || alloc.qty || 1);
      const cost = Number((qty * (warehouse ? warehouse.shipping_weight : 1.0)).toFixed(2));

      await FulfillmentSplit.create({
        fulfillment_order_id: fulfillmentOrderId,
        warehouse_id: warehouseId,
        product_id: productId,
        qty_fulfilled: qty,
        estimated_shipments: 1,
        cost
      });
    }

    const remainingBackorders = await Backorder.find({ fulfillment_order_id: fulfillmentOrderId, resolved: false });
    order.status = remainingBackorders.length > 0 ? 'Backorder' : 'Fulfilled';
    await order.save();

    const populatedSplits = await FulfillmentSplit.find({ fulfillment_order_id: fulfillmentOrderId })
      .populate('warehouse_id product_id');

    const formattedSplits = populatedSplits.map((s) => ({
      ...s.toObject(),
      id: s._id,
      warehouse_name: s.warehouse_id?.name || 'Main Logistics Depot',
      product_name: s.product_id?.name || 'Catalog Product',
      qty_fulfilled: s.qty_fulfilled ?? 1,
      estimated_shipments: s.estimated_shipments ?? 1,
      cost: s.cost ?? 0
    }));

    return { order, splits: formattedSplits };
  }

  async consolidateBackorder(fulfillmentOrderId) {
    const order = await FulfillmentOrder.findById(fulfillmentOrderId);
    if (!order) {
      const err = new Error('Fulfillment order not found');
      err.statusCode = 404;
      throw err;
    }

    const backorders = await Backorder.find({ fulfillment_order_id: fulfillmentOrderId, resolved: false });
    if (backorders.length === 0) {
      return { message: 'No active backorders to consolidate' };
    }

    const warehouses = await Warehouse.find();
    const stocks = await WarehouseStock.find();

    const orderLines = backorders.map((b) => ({
      product_id: b.product_id,
      qty: b.qty_pending
    }));

    const { splits, backorders: newBackorders } = calculateWarehouseSplit(orderLines, stocks, warehouses);

    for (const s of splits) {
      await FulfillmentSplit.create({
        fulfillment_order_id: fulfillmentOrderId,
        warehouse_id: s.warehouse_id,
        product_id: s.product_id,
        qty_fulfilled: s.qty_fulfilled,
        estimated_shipments: 1,
        cost: s.cost
      });
    }

    await Backorder.deleteMany({ fulfillment_order_id: fulfillmentOrderId });
    for (const nb of newBackorders) {
      await Backorder.create({
        fulfillment_order_id: fulfillmentOrderId,
        product_id: nb.product_id,
        qty_pending: nb.qty_pending,
        resolved: nb.resolved
      });
    }

    order.status = newBackorders.length > 0 ? 'Backorder' : 'Fulfilled';
    await order.save();

    return { order, newSplits: splits, unresolvedBackorders: newBackorders };
  }
}

export const fulfillmentService = new FulfillmentService();
export default fulfillmentService;
