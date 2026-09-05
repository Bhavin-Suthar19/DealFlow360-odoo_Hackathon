import mongoose from 'mongoose';
import crypto from 'crypto';

const rfqItemSchema = new mongoose.Schema(
  {
    product_id: { type: String, ref: 'Product', required: true },
    requested_qty: { type: Number, required: true, min: 1, default: 1 },
    notes: { type: String, default: '' }
  },
  { _id: false }
);

const quotationRequestSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    rfq_number: { type: String, required: true, unique: true, trim: true },
    customer_id: { type: String, ref: 'Customer', required: true },
    requested_by: { type: String, ref: 'CustomerUser' },
    assigned_sales_rep_id: { type: String, ref: 'User' },
    items: [rfqItemSchema],
    customer_notes: { type: String, default: '' },
    target_delivery_date: { type: Date, default: null },
    status: {
      type: String,
      enum: ['Submitted', 'In Review', 'Converted', 'Cancelled'],
      required: true,
      default: 'Submitted'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

quotationRequestSchema.virtual('id').get(function () {
  return this._id;
});

export const QuotationRequest = mongoose.models.QuotationRequest || mongoose.model('QuotationRequest', quotationRequestSchema);
export default QuotationRequest;
