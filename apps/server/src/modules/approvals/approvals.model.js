import mongoose from 'mongoose';
import crypto from 'crypto';

const approvalSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    quotation_id: { type: String, ref: 'Quotation', required: true },
    risk_level: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      required: true
    },
    blended_risk_score: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['Pending', 'Returned', 'Approved', 'Rejected'],
      required: true,
      index: true,
      default: 'Pending'
    },
    assigned_to: { type: String, ref: 'User', required: true }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

approvalSchema.virtual('id').get(function () {
  return this._id;
});

export const Approval = mongoose.models.Approval || mongoose.model('Approval', approvalSchema);
export default Approval;
