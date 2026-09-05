import mongoose from 'mongoose';
import crypto from 'crypto';

const approvalChainRuleSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    min_discount_pct: { type: Number, required: true },
    max_discount_pct: { type: Number, required: true },
    risk_level: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

approvalChainRuleSchema.virtual('id').get(function () {
  return this._id;
});

export const ApprovalChainRule = mongoose.models.ApprovalChainRule || mongoose.model('ApprovalChainRule', approvalChainRuleSchema);
export default ApprovalChainRule;
