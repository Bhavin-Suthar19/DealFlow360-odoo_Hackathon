export class WarehousesService {
  async getAll() {
    return { message: 'Get all warehouses' };
  }

  async getById(id) {
    return { id, message: 'Get warehouses by ID' };
  }

  async create(data) {
    return { data, message: 'Created warehouses' };
  }
}

export const warehousesService = new WarehousesService();
