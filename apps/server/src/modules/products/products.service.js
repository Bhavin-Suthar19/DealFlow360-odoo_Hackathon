export class ProductsService {
  async getAll() {
    return { message: 'Get all products' };
  }

  async getById(id) {
    return { id, message: 'Get products by ID' };
  }

  async create(data) {
    return { data, message: 'Created products' };
  }
}

export const productsService = new ProductsService();
