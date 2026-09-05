import mongoose from 'mongoose';
import crypto from 'crypto';

const productSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    name: { type: String, required: true, trim: true },
    category_id: { type: String, ref: 'Category', required: true, index: true },
    unit: { type: String, required: true, default: 'unit' },
    tax_pct: { type: Number, required: true, default: 0 },
    description: { type: String, default: '' },
    base_price: { type: Number, required: true, default: 0 },
    stock_on_hand: { type: Number, required: true, default: 50 },
    is_subscription: { type: Boolean, required: true, default: false },
    recurring_cycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly', null],
      default: null
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.virtual('id').get(function () {
  return this._id;
});

productSchema.virtual('price').get(function () {
  return this.base_price;
}).set(function (val) {
  this.base_price = val;
});

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
