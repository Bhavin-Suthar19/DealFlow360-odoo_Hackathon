import mongoose from 'mongoose';
import crypto from 'crypto';

const categoryDiscountCeilingSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    category_id: { type: String, ref: 'Category', required: true, unique: true },
    max_discount_pct: { type: Number, required: true }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

categoryDiscountCeilingSchema.virtual('id').get(function () {
  return this._id;
});

export const CategoryDiscountCeiling = mongoose.models.CategoryDiscountCeiling || mongoose.model('CategoryDiscountCeiling', categoryDiscountCeilingSchema);
export default CategoryDiscountCeiling;
