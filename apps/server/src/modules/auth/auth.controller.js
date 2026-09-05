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
        name: user.name,
        email: user.email,
        role: user.role,
        team_id: user.team_id
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
