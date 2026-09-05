export class AuditService {
  async getAll() {
    return { message: 'Get all audit' };
  }

  async getById(id) {
    return { id, message: 'Get audit by ID' };
  }

  async create(data) {
    return { data, message: 'Created audit' };
  }
}

export const auditService = new AuditService();
