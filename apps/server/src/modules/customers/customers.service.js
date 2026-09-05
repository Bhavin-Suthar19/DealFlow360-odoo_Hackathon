export class CustomersService {
  async getAll() {
    return { message: 'Get all customers' };
  }

  async getById(id) {
    return { id, message: 'Get customers by ID' };
  }

  async create(data) {
    return { data, message: 'Created customers' };
  }
}

export const customersService = new CustomersService();
