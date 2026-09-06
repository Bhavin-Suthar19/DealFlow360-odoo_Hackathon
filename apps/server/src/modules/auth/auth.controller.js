import authService from './auth.service.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.util.js';
import jwt from 'jsonwebtoken';
import env from '../../config/env.config.js';
import { User } from '../../models/index.js';

export const me = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 'UNAUTHORIZED', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (decoded.tokenType === 'portal' || decoded.customerUserId) {
      const { CustomerUser, Customer } = await import('../../models/index.js');
      const custUser = await CustomerUser.findById(decoded.customerUserId || decoded.userId);
      if (!custUser) {
        return errorResponse(res, 'Customer user not found', 'NOT_FOUND', 404);
      }
      const customerOrg = custUser.customer_id ? await Customer.findById(custUser.customer_id) : null;
      return successResponse(res, {
        user: {
          id: custUser._id,
          _id: custUser._id,
          name: custUser.name,
          email: custUser.email,
          phone: custUser.phone || '',
          role: 'customer',
          customer_id: custUser.customer_id,
          company_name: customerOrg?.name || custUser.name,
          tier: customerOrg?.tier || 'Silver',
          currency: customerOrg?.currency || 'USD',
          department: 'Customer Organization'
        }
      });
    }

    if (!decoded.userId) {
      return errorResponse(res, 'Invalid token', 'UNAUTHORIZED', 401);
    }

    const user = await User.findById(decoded.userId).select('-password_hash');
    if (!user) {
      return errorResponse(res, 'User not found', 'NOT_FOUND', 404);
    }

    return successResponse(res, {
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        team_id: user.team_id,
        department: user.department || '',
        phone: user.phone || ''
      }
    });
  } catch (err) {
    return errorResponse(res, 'Invalid or expired token', 'UNAUTHORIZED', 401);
  }
};

export const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    if (result.refreshToken) {
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    }
    return successResponse(res, { user: result.user, token: result.token }, null, 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    if (result.refreshToken) {
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
    }
    return successResponse(res, { user: result.user, token: result.token });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const tokenString = req.cookies?.refreshToken || req.body?.refreshToken;
    const result = await authService.refreshToken(tokenString);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken');
    return successResponse(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const portalLogin = async (req, res, next) => {
  try {
    const result = await authService.portalLogin(req.body);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.body?.id;
    const result = await authService.updateProfile
      ? await authService.updateProfile(userId, req.body, req.user)
      : (await import('../users/users.service.js')).default.updateProfile(userId, req.body, req.user);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};
