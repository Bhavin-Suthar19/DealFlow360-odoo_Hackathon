import mongoose from 'mongoose';
import crypto from 'crypto';

const backorderSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    fulfillment_order_id: { type: String, ref: 'FulfillmentOrder', required: true },
    product_id: { type: String, ref: 'Product', required: true },
    qty_pending: { type: Number, required: true, default: 0 },
    resolved: { type: Boolean, required: true, default: false }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

backorderSchema.virtual('id').get(function () {
  return this._id;
});

export const Backorder = mongoose.models.Backorder || mongoose.model('Backorder', backorderSchema);
export default Backorder;
