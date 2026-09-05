import mongoose from 'mongoose';
import crypto from 'crypto';

const discountTierSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    tier_name: { type: String, required: true, unique: true, trim: true },
    max_discount_pct: { type: Number, required: true }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

discountTierSchema.virtual('id').get(function () {
  return this._id;
});

export const DiscountTier = mongoose.models.DiscountTier || mongoose.model('DiscountTier', discountTierSchema);
export default DiscountTier;
