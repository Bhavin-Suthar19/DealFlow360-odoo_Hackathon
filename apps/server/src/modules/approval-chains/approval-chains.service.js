export class ApprovalChainsService {
  async getAll() {
    return { message: 'Get all approval-chains' };
  }

  async getById(id) {
    return { id, message: 'Get approval-chains by ID' };
  }

  async create(data) {
    return { data, message: 'Created approval-chains' };
  }
}

export const approvalChainsService = new ApprovalChainsService();
