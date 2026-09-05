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

    return paginate(FulfillmentOrder, filter, {
      page: query.page,
      limit: query.limit,
      populate: ['quotation_id']
    });
  }

  async getById(id) {
    const order = await FulfillmentOrder.findById(id).populate('quotation_id');
    if (!order) {
      const err = new Error('Fulfillment order not found');
      err.statusCode = 404;
      throw err;
    }
    const splits = await FulfillmentSplit.find({ fulfillment_order_id: id }).populate('warehouse_id product_id');
    const backorders = await Backorder.find({ fulfillment_order_id: id }).populate('product_id');
    return { order, splits, backorders };
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

    return { order, splits: createdSplits, backorders: createdBackorders };
  }

  async manualOverride(fulfillmentOrderId, allocations = []) {
    const order = await FulfillmentOrder.findById(fulfillmentOrderId);
    if (!order) {
      const err = new Error('Fulfillment order not found');
      err.statusCode = 404;
      throw err;
    }

    await FulfillmentSplit.deleteMany({ fulfillment_order_id: fulfillmentOrderId });

    const createdSplits = [];
    for (const alloc of allocations) {
      const warehouse = await Warehouse.findById(alloc.warehouse_id);
      const cost = Number((alloc.qty_fulfilled * (warehouse ? warehouse.shipping_weight : 1.0)).toFixed(2));

      const split = await FulfillmentSplit.create({
        fulfillment_order_id: fulfillmentOrderId,
        warehouse_id: alloc.warehouse_id,
        product_id: alloc.product_id,
        qty_fulfilled: alloc.qty_fulfilled,
        estimated_shipments: 1,
        cost
      });
      createdSplits.push(split);
    }

    const remainingBackorders = await Backorder.find({ fulfillment_order_id: fulfillmentOrderId, resolved: false });
    order.status = remainingBackorders.length > 0 ? 'Backorder' : 'Fulfilled';
    await order.save();

    return { order, splits: createdSplits };
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
