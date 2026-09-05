import { AuditLog } from '../../models/index.js';
import { paginate } from '../../utils/paginate.util.js';

export class AuditService {
  async getLogs(query = {}) {
    const filter = {};
    if (query.entityType) filter.entity_type = query.entityType;
    if (query.entityId) filter.entity_id = query.entityId;
    if (query.userId) filter.user_id = query.userId;

    return paginate(AuditLog, filter, {
      page: query.page,
      limit: query.limit,
      populate: ['user_id'],
      sort: { timestamp: -1 }
    });
  }
}

export const auditService = new AuditService();
export default auditService;
