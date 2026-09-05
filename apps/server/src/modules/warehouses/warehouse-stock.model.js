import mongoose from 'mongoose';
import crypto from 'crypto';

const warehouseStockSchema = new mongoose.Schema(
  {
    _id: { type: String, default: () => crypto.randomUUID() },
    warehouse_id: { type: String, ref: 'Warehouse', required: true },
    product_id: { type: String, ref: 'Product', required: true },
    qty_in_stock: { type: Number, required: true, default: 0 },
    qty_reserved: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// CK: unique(warehouse_id, product_id)
warehouseStockSchema.index({ warehouse_id: 1, product_id: 1 }, { unique: true });

warehouseStockSchema.virtual('id').get(function () {
  return this._id;
});

export const WarehouseStock = mongoose.models.WarehouseStock || mongoose.model('WarehouseStock', warehouseStockSchema);
export default WarehouseStock;
