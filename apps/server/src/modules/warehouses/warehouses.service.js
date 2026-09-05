import { Warehouse, WarehouseStock, Product } from '../../models/index.js';
import { paginate } from '../../utils/paginate.util.js';

export class WarehousesService {
  async getAll(query = {}) {
    return paginate(Warehouse, {}, { page: query.page, limit: query.limit });
  }

  async create(data) {
    return Warehouse.create(data);
  }

  async update(id, data) {
    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
      const err = new Error('Warehouse not found');
      err.statusCode = 404;
      throw err;
    }
    Object.assign(warehouse, data);
    await warehouse.save();
    return warehouse;
  }

  async getStock(warehouseId) {
    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      const err = new Error('Warehouse not found');
      err.statusCode = 404;
      throw err;
    }
    return WarehouseStock.find({ warehouse_id: warehouseId }).populate('product_id');
  }

  async updateStock(warehouseId, data) {
    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      const err = new Error('Warehouse not found');
      err.statusCode = 404;
      throw err;
    }
    const product = await Product.findById(data.product_id);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }

    let stock = await WarehouseStock.findOne({ warehouse_id: warehouseId, product_id: data.product_id });
    if (!stock) {
      stock = new WarehouseStock({
        warehouse_id: warehouseId,
        product_id: data.product_id,
        qty_in_stock: data.qty_in_stock,
        qty_reserved: data.qty_reserved || 0
      });
    } else {
      stock.qty_in_stock = data.qty_in_stock;
      if (data.qty_reserved !== undefined) stock.qty_reserved = data.qty_reserved;
    }

    await stock.save();
    return stock;
  }

  async getAllStock() {
    const stocks = await WarehouseStock.find()
      .populate('warehouse_id', 'name shipping_weight location')
      .populate('product_id', 'name sku base_price');

    return stocks.map((st) => ({
      id: st._id,
      _id: st._id,
      warehouse_id: st.warehouse_id?._id || st.warehouse_id,
      warehouse_name: st.warehouse_id?.name || 'Main Warehouse',
      product_id: st.product_id?._id || st.product_id,
      product_name: st.product_id?.name || 'Product',
      qty_in_stock: st.qty_in_stock || 0,
      qty_reserved: st.qty_reserved || 0,
      qty_available: Math.max(0, (st.qty_in_stock || 0) - (st.qty_reserved || 0))
    }));
  }
}

export const warehousesService = new WarehousesService();
export default warehousesService;
