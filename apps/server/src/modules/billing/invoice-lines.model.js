import mongoose from 'mongoose';
import crypto from 'crypto';

const invoiceLineSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    invoice_id: { type: String, ref: 'Invoice', required: true },
    quotation_line_id: { type: String, ref: 'QuotationLine', required: true },
    amount: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

invoiceLineSchema.virtual('id').get(function () {
  return this._id;
});

export const InvoiceLine = mongoose.models.InvoiceLine || mongoose.model('InvoiceLine', invoiceLineSchema);
export default InvoiceLine;
