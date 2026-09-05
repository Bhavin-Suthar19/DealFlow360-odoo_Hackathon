import mongoose from 'mongoose';
import crypto from 'crypto';

const warehouseSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    name: { type: String, required: true, unique: true, trim: true },
    shipping_weight: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

warehouseSchema.virtual('id').get(function () {
  return this._id;
});

export const Warehouse = mongoose.models.Warehouse || mongoose.model('Warehouse', warehouseSchema);
export default Warehouse;
