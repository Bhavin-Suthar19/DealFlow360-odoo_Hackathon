import mongoose from 'mongoose';
import crypto from 'crypto';

const upsellRuleSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    base_product_id: { type: String, ref: 'Product', required: true },
    suggested_product_id: { type: String, ref: 'Product', required: true },
    min_margin_pct: { type: Number, required: true, default: 0 },
    is_promoted: { type: Boolean, required: true, default: false }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// CK: unique(base_product_id, suggested_product_id)
upsellRuleSchema.index({ base_product_id: 1, suggested_product_id: 1 }, { unique: true });

upsellRuleSchema.virtual('id').get(function () {
  return this._id;
});

export const UpsellRule = mongoose.models.UpsellRule || mongoose.model('UpsellRule', upsellRuleSchema);
export default UpsellRule;
