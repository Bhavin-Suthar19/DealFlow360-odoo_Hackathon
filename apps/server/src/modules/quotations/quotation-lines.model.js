import mongoose from 'mongoose';
import crypto from 'crypto';

const quotationLineSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    quotation_id: { type: String, ref: 'Quotation', required: true, index: true },
    product_id: { type: String, ref: 'Product', required: true },
    qty: { type: Number, required: true, default: 1 },
    unit_price: { type: Number, required: true, default: 0 },
    discount_pct: { type: Number, required: true, default: 0 },
    discount_limit_pct: { type: Number, required: true, default: 0 }, // Snapshot of applicable ceiling at time of quoting
    line_type: {
      type: String,
      enum: ['one_time', 'recurring'],
      required: true,
      default: 'one_time'
    },
    is_upsell: { type: Boolean, required: true, default: false }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

quotationLineSchema.virtual('id').get(function () {
  return this._id;
});

export const QuotationLine = mongoose.models.QuotationLine || mongoose.model('QuotationLine', quotationLineSchema);
export default QuotationLine;
