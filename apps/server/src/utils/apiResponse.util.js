/**
 * Standardized API Response Utilities
 *
 * Success Shape: { success: true, data: {...}, meta: {...} }
 * Error Shape:   { success: false, error: { code: '...', message: '...' } }
 */

export const successResponse = (res, data = {}, meta = null, statusCode = 200) => {
  const payload = {
    success: true,
    data
  };
  if (meta) {
    payload.meta = meta;
  }
  return res.status(statusCode).json(payload);
};

export const errorResponse = (res, message = 'An error occurred', code = 'INTERNAL_ERROR', statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
};
