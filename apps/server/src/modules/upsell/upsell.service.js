export class UpsellService {
  async getAll() {
    return { message: 'Get all upsell' };
  }

  async getById(id) {
    return { id, message: 'Get upsell by ID' };
  }

  async create(data) {
    return { data, message: 'Created upsell' };
  }
}

export const upsellService = new UpsellService();
