import { Customer } from '../../models/index.js';
import { paginate } from '../../utils/paginate.util.js';

export class CustomersService {
  async getAll(query = {}) {
    const filter = {};
    if (query.tier) filter.tier = query.tier;
    if (query.name) filter.name = { $regex: query.name, $options: 'i' };

    return paginate(Customer, filter, {
      page: query.page,
      limit: query.limit || 500,
      sort: { name: 1 }
    });
  }

  async getById(id) {
    const customer = await Customer.findById(id);
    if (!customer) {
      const err = new Error('Customer not found');
      err.statusCode = 404;
      throw err;
    }
    return customer;
  }

  async create(data) {
    return Customer.create(data);
  }
}

export const customersService = new CustomersService();
export default customersService;
