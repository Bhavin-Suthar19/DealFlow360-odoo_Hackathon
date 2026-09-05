import mongoose from 'mongoose';
import crypto from 'crypto';

const productVariantSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    product_id: { type: String, ref: 'Product', required: true },
    attribute_name: { type: String, required: true, trim: true },
    attribute_value: { type: String, required: true, trim: true },
    extra_price: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// CK: unique(product_id, attribute_name, attribute_value)
productVariantSchema.index({ product_id: 1, attribute_name: 1, attribute_value: 1 }, { unique: true });

productVariantSchema.virtual('id').get(function () {
  return this._id;
});

export const ProductVariant = mongoose.models.ProductVariant || mongoose.model('ProductVariant', productVariantSchema);
export default ProductVariant;
