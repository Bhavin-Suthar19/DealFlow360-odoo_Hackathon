import mongoose from 'mongoose';
import crypto from 'crypto';

const subscriptionPlanSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    name: { type: String, required: true, trim: true },
    cycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly'],
      required: true
    },
    proration_rule: { type: String, default: '' },
    cancellation_rule: { type: String, default: '' }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

subscriptionPlanSchema.virtual('id').get(function () {
  return this._id;
});

export const SubscriptionPlan = mongoose.models.SubscriptionPlan || mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
export default SubscriptionPlan;
