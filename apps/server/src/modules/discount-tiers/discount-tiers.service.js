export class DiscountTiersService {
  async getAll() {
    return { message: 'Get all discount-tiers' };
  }

  async getById(id) {
    return { id, message: 'Get discount-tiers by ID' };
  }

  async create(data) {
    return { data, message: 'Created discount-tiers' };
  }
}

export const discountTiersService = new DiscountTiersService();
