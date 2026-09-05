import mongoose from 'mongoose';
import crypto from 'crypto';

const creditNoteSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    subscription_id: { type: String, ref: 'Subscription', default: null },
    invoice_id: { type: String, ref: 'Invoice', default: null },
    amount: { type: Number, required: true },
    reason: { type: String, required: true, trim: true }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

creditNoteSchema.virtual('id').get(function () {
  return this._id;
});

export const CreditNote = mongoose.models.CreditNote || mongoose.model('CreditNote', creditNoteSchema);
export default CreditNote;
