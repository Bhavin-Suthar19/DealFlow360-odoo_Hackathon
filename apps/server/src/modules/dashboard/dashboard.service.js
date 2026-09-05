export class DashboardService {
  async getAll() {
    return { message: 'Get all dashboard' };
  }

  async getById(id) {
    return { id, message: 'Get dashboard by ID' };
  }

  async create(data) {
    return { data, message: 'Created dashboard' };
  }
}

export const dashboardService = new DashboardService();
