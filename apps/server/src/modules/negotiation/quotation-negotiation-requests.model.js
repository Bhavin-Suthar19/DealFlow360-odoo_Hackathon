import mongoose from 'mongoose';
import crypto from 'crypto';

const quotationNegotiationRequestSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    quotation_id: { type: String, ref: 'Quotation', required: true },
    line_id: { type: String, ref: 'QuotationLine', default: null },
    requested_by: { type: String, ref: 'CustomerUser', required: true },
    comment: { type: String, required: true, trim: true },
    counter_discount_pct: { type: Number, default: 0 },
    requested_delivery_date: { type: Date, default: null },
    status: {
      type: String,
      enum: ['Submitted', 'Reviewed', 'Accepted', 'Rejected'],
      required: true,
      default: 'Submitted'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

quotationNegotiationRequestSchema.virtual('id').get(function () {
  return this._id;
});

export const QuotationNegotiationRequest = mongoose.models.QuotationNegotiationRequest || mongoose.model('QuotationNegotiationRequest', quotationNegotiationRequestSchema);
export default QuotationNegotiationRequest;
