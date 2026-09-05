import mongoose from 'mongoose';
import crypto from 'crypto';

const quotationSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    quote_number: { type: String, required: true, unique: true, trim: true },
    customer_id: { type: String, ref: 'Customer', required: true },
    sales_rep_id: { type: String, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Draft', 'Pending Approval', 'Approved', 'Negotiation', 'Confirmed', 'Rejected'],
      required: true,
      index: true,
      default: 'Draft'
    },
    blended_risk_score: { type: Number, required: true, default: 0 },
    total_amount: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

quotationSchema.virtual('id').get(function () {
  return this._id;
});

export const Quotation = mongoose.models.Quotation || mongoose.model('Quotation', quotationSchema);
export default Quotation;
