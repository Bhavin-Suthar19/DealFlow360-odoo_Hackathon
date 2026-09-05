import mongoose from 'mongoose';
import crypto from 'crypto';

const paymentSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    invoice_id: { type: String, ref: 'Invoice', required: true },
    amount_paid: { type: Number, required: true, default: 0 },
    payment_date: { type: Date, required: true, default: Date.now },
    method: { type: String, required: true, default: 'bank_transfer' }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

paymentSchema.virtual('id').get(function () {
  return this._id;
});

export const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export default Payment;
