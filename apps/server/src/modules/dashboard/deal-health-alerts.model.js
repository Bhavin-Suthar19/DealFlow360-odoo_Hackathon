import mongoose from 'mongoose';
import crypto from 'crypto';

const dealHealthAlertSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    quotation_id: { type: String, ref: 'Quotation', required: true },
    alert_type: {
      type: String,
      enum: ['Stalled', 'Discount Anomaly', 'Delivery Slippage'],
      required: true,
      index: true
    },
    detail: { type: String, required: true, trim: true },
    flagged_at: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      enum: ['Open', 'Escalated', 'Nudged', 'Resolved'],
      required: true,
      default: 'Open'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

dealHealthAlertSchema.virtual('id').get(function () {
  return this._id;
});

export const DealHealthAlert = mongoose.models.DealHealthAlert || mongoose.model('DealHealthAlert', dealHealthAlertSchema);
export default DealHealthAlert;
