import redis from '../config/redis.config.js';

export const rateLimiter = (limit = 100, windowInSeconds = 60) => {
  return async (req, res, next) => {
    const key = `ratelimit:${req.ip}:${req.user ? req.user.id : 'anon'}`;
    try {
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, windowInSeconds);
      }
      if (current > limit) {
        return res.status(429).json({ success: false, message: 'Too many requests, please try again later.' });
      }
      next();
    } catch (err) {
      // Fallback on Redis failure
      next();
    }
  };
};
