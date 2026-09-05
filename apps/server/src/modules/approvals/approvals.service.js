export class ApprovalsService {
  async getAll() {
    return { message: 'Get all approvals' };
  }

  async getById(id) {
    return { id, message: 'Get approvals by ID' };
  }

  async create(data) {
    return { data, message: 'Created approvals' };
  }
}

export const approvalsService = new ApprovalsService();
