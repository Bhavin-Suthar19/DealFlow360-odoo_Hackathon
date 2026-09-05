export class FulfillmentService {
  async getAll() {
    return { message: 'Get all fulfillment' };
  }

  async getById(id) {
    return { id, message: 'Get fulfillment by ID' };
  }

  async create(data) {
    return { data, message: 'Created fulfillment' };
  }
}

export const fulfillmentService = new FulfillmentService();
