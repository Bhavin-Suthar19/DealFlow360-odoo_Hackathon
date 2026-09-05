import mongoose from 'mongoose';
import crypto from 'crypto';

const invoiceSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    invoice_number: { type: String, required: true, unique: true, trim: true },
    quotation_id: { type: String, ref: 'Quotation', required: true },
    customer_id: { type: String, ref: 'Customer', required: true },
    amount: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['Unpaid', 'Paid'],
      required: true,
      index: true,
      default: 'Unpaid'
    },
    due_date: { type: Date, required: true },
    payment_stage: {
      type: String,
      enum: ['Order Confirmed', 'Shipped', 'Invoiced', 'Paid'],
      required: true,
      default: 'Invoiced'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

invoiceSchema.virtual('id').get(function () {
  return this._id;
});

export const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
export default Invoice;
