export class NegotiationService {
  async getAll() {
    return { message: 'Get all negotiation' };
  }

  async getById(id) {
    return { id, message: 'Get negotiation by ID' };
  }

  async create(data) {
    return { data, message: 'Created negotiation' };
  }
}

export const negotiationService = new NegotiationService();
