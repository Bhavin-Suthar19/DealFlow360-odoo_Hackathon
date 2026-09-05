import authService from './auth.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    return successResponse(res, result, null, 201);
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
