import redis from '../config/redis.config.js';

export const checkLockout = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next();

  const lockoutKey = `lockout:${email.toLowerCase()}`;
  try {
    const isLocked = await redis.get(lockoutKey);
    if (isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to repeated failed attempts. Please try again later.'
      });
    }
    next();
  } catch (err) {
    next();
  }
};
