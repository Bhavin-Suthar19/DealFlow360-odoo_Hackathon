import { AuditLog } from '../models/index.js';

export const auditMiddleware = (req, res, next) => {
  const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);

  if (!isMutating) {
    return next();
  }

  const originalSend = res.send;

  res.send = function (data) {
    res.send = originalSend;
    const response = res.send.apply(res, arguments);

    // Only audit successful mutations (status 2xx)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      process.nextTick(async () => {
        try {
          const userId = req.user?.userId || req.customerUser?.customerUserId || 'system';
          const pathParts = req.baseUrl ? req.baseUrl.split('/').filter(Boolean) : [];
          const entityType = pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'entity';
          const entityId = req.params.id || req.params.lineId || req.body?.id || 'unknown';
          const action = `${req.method} ${req.originalUrl}`;

          await AuditLog.create({
            entity_type: entityType,
            entity_id: String(entityId),
            user_id: String(userId),
            action: action,
            timestamp: new Date()
          });
        } catch (err) {
          // Silent catch to prevent audit failure from breaking response
          console.error('Audit logging failed:', err.message);
        }
      });
    }

    return response;
  };

  next();
};

export default auditMiddleware;
