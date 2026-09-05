import mongoose from 'mongoose';
import crypto from 'crypto';

const fulfillmentOrderSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    quotation_id: { type: String, ref: 'Quotation', required: true, index: true },
    status: {
      type: String,
      enum: ['Split Pending', 'Backorder', 'Fulfilled'],
      required: true,
      default: 'Split Pending'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

fulfillmentOrderSchema.virtual('id').get(function () {
  return this._id;
});

export const FulfillmentOrder = mongoose.models.FulfillmentOrder || mongoose.model('FulfillmentOrder', fulfillmentOrderSchema);
export default FulfillmentOrder;
