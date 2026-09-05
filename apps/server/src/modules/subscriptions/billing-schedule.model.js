import mongoose from 'mongoose';
import crypto from 'crypto';

const billingScheduleSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    subscription_id: { type: String, ref: 'Subscription', required: true },
    bill_date: { type: Date, required: true, index: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Paid', 'Unpaid'],
      required: true,
      default: 'Unpaid'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

billingScheduleSchema.virtual('id').get(function () {
  return this._id;
});

export const BillingSchedule = mongoose.models.BillingSchedule || mongoose.model('BillingSchedule', billingScheduleSchema);
export default BillingSchedule;
