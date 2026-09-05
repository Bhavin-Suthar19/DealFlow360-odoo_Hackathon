import mongoose from 'mongoose';
import crypto from 'crypto';

const subscriptionSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    customer_id: { type: String, ref: 'Customer', required: true },
    plan_id: { type: String, ref: 'SubscriptionPlan', required: true },
    quotation_id: { type: String, ref: 'Quotation', required: true },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Cancelled'],
      required: true,
      index: true,
      default: 'Active'
    },
    next_bill_date: { type: Date, required: true },
    amount: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

subscriptionSchema.virtual('id').get(function () {
  return this._id;
});

export const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
