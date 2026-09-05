import mongoose from 'mongoose';
import crypto from 'crypto';

const priceListSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    tier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', null],
      default: null
    },
    currency: { type: String, required: true, default: 'USD' },
    price_rule: { type: String, required: true, trim: true }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

priceListSchema.virtual('id').get(function () {
  return this._id;
});

export const PriceList = mongoose.models.PriceList || mongoose.model('PriceList', priceListSchema);
export default PriceList;
