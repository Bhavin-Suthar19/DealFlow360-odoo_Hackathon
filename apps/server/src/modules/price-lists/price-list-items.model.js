import mongoose from 'mongoose';
import crypto from 'crypto';

const priceListItemSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    price_list_id: { type: String, ref: 'PriceList', required: true },
    product_id: { type: String, ref: 'Product', required: true },
    price: { type: Number, required: true }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// CK: unique(price_list_id, product_id)
priceListItemSchema.index({ price_list_id: 1, product_id: 1 }, { unique: true });

priceListItemSchema.virtual('id').get(function () {
  return this._id;
});

export const PriceListItem = mongoose.models.PriceListItem || mongoose.model('PriceListItem', priceListItemSchema);
export default PriceListItem;
