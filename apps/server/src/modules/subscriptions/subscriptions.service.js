export class SubscriptionsService {
  async getAll() {
    return { message: 'Get all subscriptions' };
  }

  async getById(id) {
    return { id, message: 'Get subscriptions by ID' };
  }

  async create(data) {
    return { data, message: 'Created subscriptions' };
  }
}

export const subscriptionsService = new SubscriptionsService();
