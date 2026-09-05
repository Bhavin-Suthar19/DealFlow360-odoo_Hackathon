export class BillingService {
  async getAll() {
    return { message: 'Get all billing' };
  }

  async getById(id) {
    return { id, message: 'Get billing by ID' };
  }

  async create(data) {
    return { data, message: 'Created billing' };
  }
}

export const billingService = new BillingService();
