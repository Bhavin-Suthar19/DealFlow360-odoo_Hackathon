import mongoose from 'mongoose';
import crypto from 'crypto';

const approvalStepLogSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    approval_id: { type: String, ref: 'Approval', required: true },
    user_id: { type: String, ref: 'User', required: true },
    action: {
      type: String,
      enum: ['Submitted', 'Returned', 'Resubmitted', 'Approved', 'Rejected'],
      required: true
    },
    note: { type: String, default: '' },
    action_date: { type: Date, required: true, default: Date.now, index: true }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

approvalStepLogSchema.virtual('id').get(function () {
  return this._id;
});

export const ApprovalStepLog = mongoose.models.ApprovalStepLog || mongoose.model('ApprovalStepLog', approvalStepLogSchema);
export default ApprovalStepLog;
