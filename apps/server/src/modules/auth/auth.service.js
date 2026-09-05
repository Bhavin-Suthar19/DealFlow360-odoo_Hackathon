import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../../config/env.config.js';
import { User, CustomerUser } from '../../models/index.js';
import redisLockoutService from '../../utils/redis.service.js';

export class AuthService {
  async signup(data) {
    const normEmail = data.email.toLowerCase();
    const existing = await User.findOne({ email: normEmail });
    if (existing) {
      const err = new Error('User with this email already exists');
      err.statusCode = 400;
      throw err;
    }

    const password_hash = await bcrypt.hash(data.password, 12);
    
    // Public signup is strictly defaulted to 'customer' role
    const user = await User.create({
      name: data.name,
      email: normEmail,
      password_hash,
      role: 'customer',
      team_id: null
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role, teamId: user.team_id, tokenType: 'internal' },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, tokenType: 'refresh' },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        team_id: user.team_id
      },
      token,
      refreshToken
    };
  }

  async login({ email, password }) {
    const normEmail = email.toLowerCase();

    // Step 1: Check Redis Lockout Status
    const lockStatus = await redisLockoutService.isAccountLocked(normEmail);
    if (lockStatus.isLocked) {
      const err = new Error(`Account temporarily locked due to 5 consecutive failed login attempts. Please try again after ${lockStatus.remainingMinutes} minute(s).`);
      err.statusCode = 429;
      err.isLocked = true;
      throw err;
    }

    // Step 2: Validate User
    const user = await User.findOne({ email: normEmail });
    if (!user) {
      const attemptInfo = await redisLockoutService.recordFailedAttempt(normEmail);
      if (attemptInfo.isNowLocked) {
        const err = new Error('Account temporarily locked due to 5 consecutive failed login attempts. Please try again after 15 minutes.');
        err.statusCode = 429;
        err.isLocked = true;
        throw err;
      }
      const remaining = 5 - attemptInfo.attempts;
      const err = new Error(`Invalid email or password. ${remaining} attempt(s) remaining before temporary account lock.`);
      err.statusCode = 401;
      err.remainingAttempts = remaining;
      throw err;
    }

    // Step 3: Compare Password Hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const attemptInfo = await redisLockoutService.recordFailedAttempt(normEmail);
      if (attemptInfo.isNowLocked) {
        const err = new Error('Account temporarily locked due to 5 consecutive failed login attempts. Please try again after 15 minutes.');
        err.statusCode = 429;
        err.isLocked = true;
        throw err;
      }
      const remaining = 5 - attemptInfo.attempts;
      const err = new Error(`Invalid email or password. ${remaining} attempt(s) remaining before temporary account lock.`);
      err.statusCode = 401;
      err.remainingAttempts = remaining;
      throw err;
    }

    // Clear failed attempt tracking on successful login
    await redisLockoutService.clearFailedAttempts(normEmail);

    // Step 4: Issue Dual Tokens
    const token = jwt.sign(
      { userId: user._id, role: user.role, teamId: user.team_id, tokenType: 'internal' },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, tokenType: 'refresh' },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        team_id: user.team_id
      },
      token,
      refreshToken
    };
  }

  async refreshToken(tokenString) {
    if (!tokenString) {
      const err = new Error('Refresh token required');
      err.statusCode = 401;
      throw err;
    }

    try {
      const decoded = jwt.verify(tokenString, env.JWT_SECRET);
      if (decoded.tokenType !== 'refresh') {
        const err = new Error('Invalid refresh token type');
        err.statusCode = 401;
        throw err;
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
      }

      const accessToken = jwt.sign(
        { userId: user._id, role: user.role, teamId: user.team_id, tokenType: 'internal' },
        env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      return { accessToken, user };
    } catch (error) {
      const err = new Error('Invalid or expired refresh token');
      err.statusCode = 401;
      throw err;
    }
  }

  async portalLogin({ email, password, magic_token }) {
    const customerUser = await CustomerUser.findOne({ email: email.toLowerCase() });
    if (!customerUser) {
      const err = new Error('Invalid portal credentials');
      err.statusCode = 401;
      throw err;
    }

    if (magic_token) {
      if (customerUser.auth_token !== magic_token) {
        const err = new Error('Invalid or expired magic token');
        err.statusCode = 401;
        throw err;
      }
    } else if (password) {
      if (!customerUser.password_hash) {
        const err = new Error('Password auth not configured for this user. Use magic link.');
        err.statusCode = 401;
        throw err;
      }
      const isMatch = await bcrypt.compare(password, customerUser.password_hash);
      if (!isMatch) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
      }
    } else {
      const err = new Error('Provide either password or magic_token');
      err.statusCode = 400;
      throw err;
    }

    const token = jwt.sign(
      {
        customerUserId: customerUser._id,
        customerId: customerUser.customer_id,
        tokenType: 'portal'
      },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      customerUser: {
        id: customerUser._id,
        customer_id: customerUser.customer_id,
        name: customerUser.name,
        email: customerUser.email
      },
      token
    };
  }
}

export const authService = new AuthService();
export default authService;
