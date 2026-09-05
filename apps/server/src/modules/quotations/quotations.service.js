export class QuotationsService {
  async getAll() {
    return { message: 'Get all quotations' };
  }

  async getById(id) {
    return { id, message: 'Get quotations by ID' };
  }

  async create(data) {
    return { data, message: 'Created quotations' };
  }
}

export const quotationsService = new QuotationsService();
