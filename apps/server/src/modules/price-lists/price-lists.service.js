export class PriceListsService {
  async getAll() {
    return { message: 'Get all price-lists' };
  }

  async getById(id) {
    return { id, message: 'Get price-lists by ID' };
  }

  async create(data) {
    return { data, message: 'Created price-lists' };
  }
}

export const priceListsService = new PriceListsService();
