import mongoose from 'mongoose';
import crypto from 'crypto';

const fulfillmentSplitSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    fulfillment_order_id: { type: String, ref: 'FulfillmentOrder', required: true },
    warehouse_id: { type: String, ref: 'Warehouse', required: true },
    product_id: { type: String, ref: 'Product', required: true },
    qty_fulfilled: { type: Number, required: true, default: 0 },
    estimated_shipments: { type: Number, required: true, default: 1 },
    cost: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// CK: unique(fulfillment_order_id, warehouse_id, product_id)
fulfillmentSplitSchema.index({ fulfillment_order_id: 1, warehouse_id: 1, product_id: 1 }, { unique: true });

fulfillmentSplitSchema.virtual('id').get(function () {
  return this._id;
});

export const FulfillmentSplit = mongoose.models.FulfillmentSplit || mongoose.model('FulfillmentSplit', fulfillmentSplitSchema);
export default FulfillmentSplit;
