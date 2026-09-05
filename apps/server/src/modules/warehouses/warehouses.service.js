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
}

export const warehousesService = new WarehousesService();
export default warehousesService;
