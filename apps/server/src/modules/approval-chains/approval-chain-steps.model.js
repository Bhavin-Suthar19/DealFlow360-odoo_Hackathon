import mongoose from 'mongoose';
import crypto from 'crypto';

const approvalChainStepSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    rule_id: { type: String, ref: 'ApprovalChainRule', required: true },
    step_order: { type: Number, required: true },
    approver_role: {
      type: String,
      enum: ['sales_manager', 'finance_ops'],
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// CK: unique(rule_id, step_order)
approvalChainStepSchema.index({ rule_id: 1, step_order: 1 }, { unique: true });

approvalChainStepSchema.virtual('id').get(function () {
  return this._id;
});

export const ApprovalChainStep = mongoose.models.ApprovalChainStep || mongoose.model('ApprovalChainStep', approvalChainStepSchema);
export default ApprovalChainStep;
