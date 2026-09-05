/**
 * Redis Login Attempt & Account Lockout Service
 * Includes automatic in-memory fallback if Redis connection is offline.
 */

// In-Memory Fallback Cache Store
const memoryAttempts = new Map(); // email -> { count: number, resetAt: number }
const memoryLocks = new Map(); // email -> lockUntilTimestamp

class RedisLockoutService {
  constructor() {
    this.redisClient = null;
    this.isRedisAvailable = false;
  }

  // Check account lockout status (5 failed attempts limit)
  async isAccountLocked(email) {
    const key = `locked_account:${email.toLowerCase()}`;
    
    if (this.isRedisAvailable && this.redisClient) {
      try {
        const ttl = await this.redisClient.ttl(key);
        if (ttl > 0) {
          const minutes = Math.ceil(ttl / 60);
          return { isLocked: true, remainingMinutes: minutes, ttlSeconds: ttl };
        }
      } catch (err) {
        console.warn('Redis read failed, falling back to memory store:', err.message);
      }
    }

    // Memory Fallback
    const lockUntil = memoryLocks.get(email.toLowerCase());
    if (lockUntil && Date.now() < lockUntil) {
      const remainingSec = Math.ceil((lockUntil - Date.now()) / 1000);
      const minutes = Math.ceil(remainingSec / 60);
      return { isLocked: true, remainingMinutes: minutes, ttlSeconds: remainingSec };
    } else if (lockUntil) {
      memoryLocks.delete(email.toLowerCase());
    }

    return { isLocked: false, remainingMinutes: 0, ttlSeconds: 0 };
  }

  // Record a failed login attempt
  async recordFailedAttempt(email) {
    const normEmail = email.toLowerCase();
    const lockKey = `locked_account:${normEmail}`;
    const attemptKey = `failed_attempts:${normEmail}`;

    let currentAttempts = 0;

    if (this.isRedisAvailable && this.redisClient) {
      try {
        currentAttempts = await this.redisClient.incr(attemptKey);
        if (currentAttempts === 1) {
          await this.redisClient.expire(attemptKey, 900); // 15 min window
        }

        if (currentAttempts >= 5) {
          await this.redisClient.set(lockKey, 'LOCKED', 'EX', 900); // Lock for 15 mins (900s)
          await this.redisClient.del(attemptKey);
        }

        return { attempts: currentAttempts, isNowLocked: currentAttempts >= 5 };
      } catch (err) {
        console.warn('Redis attempt record failed, using memory store:', err.message);
      }
    }

    // Memory Fallback
    const now = Date.now();
    const existing = memoryAttempts.get(normEmail);
    if (!existing || now > existing.resetAt) {
      currentAttempts = 1;
      memoryAttempts.set(normEmail, { count: 1, resetAt: now + 15 * 60 * 1000 });
    } else {
      currentAttempts = existing.count + 1;
      memoryAttempts.set(normEmail, { count: currentAttempts, resetAt: existing.resetAt });
    }

    if (currentAttempts >= 5) {
      memoryLocks.set(normEmail, now + 15 * 60 * 1000); // 15 min lock
      memoryAttempts.delete(normEmail);
      return { attempts: currentAttempts, isNowLocked: true };
    }

    return { attempts: currentAttempts, isNowLocked: false };
  }

  // Clear failed attempts upon successful login
  async clearFailedAttempts(email) {
    const normEmail = email.toLowerCase();
    const lockKey = `locked_account:${normEmail}`;
    const attemptKey = `failed_attempts:${normEmail}`;

    if (this.isRedisAvailable && this.redisClient) {
      try {
        await Promise.all([
          this.redisClient.del(attemptKey),
          this.redisClient.del(lockKey)
        ]);
      } catch (_) {}
    }

    memoryAttempts.delete(normEmail);
    memoryLocks.delete(normEmail);
  }
}

export const redisLockoutService = new RedisLockoutService();
export default redisLockoutService;
