export class ReportsService {
  async getAll() {
    return { message: 'Get all reports' };
  }

  async getById(id) {
    return { id, message: 'Get reports by ID' };
  }

  async create(data) {
    return { data, message: 'Created reports' };
  }
}

export const reportsService = new ReportsService();
