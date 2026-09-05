import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../../config/env.config.js';
import { User, CustomerUser } from '../../models/index.js';

export class AuthService {
  async signup(data) {
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      const err = new Error('User with this email already exists');
      err.statusCode = 400;
      throw err;
    }

    const password_hash = await bcrypt.hash(data.password, 12);
    const user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password_hash,
      role: data.role,
      team_id: data.team_id || null
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role, teamId: user.team_id, tokenType: 'internal' },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN || '8h' }
    );

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        team_id: user.team_id
      },
      token
    };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, teamId: user.team_id, tokenType: 'internal' },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN || '8h' }
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
