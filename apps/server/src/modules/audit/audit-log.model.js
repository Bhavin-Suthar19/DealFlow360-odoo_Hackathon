import mongoose from 'mongoose';
import crypto from 'crypto';

const auditLogSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    entity_type: { type: String, required: true, trim: true },
    entity_id: { type: String, required: true },
    user_id: { type: String, ref: 'User', required: true },
    action: { type: String, required: true, trim: true },
    timestamp: { type: Date, required: true, default: Date.now }
  },
  {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// IDX: composite (entity_type, entity_id)
auditLogSchema.index({ entity_type: 1, entity_id: 1, timestamp: -1 });

auditLogSchema.virtual('id').get(function () {
  return this._id;
});

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
