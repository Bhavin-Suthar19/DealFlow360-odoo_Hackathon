import { errorResponse } from '../utils/apiResponse.util.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!result.success) {
      const formattedErrors = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return errorResponse(res, `Validation failed: ${formattedErrors}`, 'VALIDATION_ERROR', 400);
    }
    next();
  };
};

export default validate;
