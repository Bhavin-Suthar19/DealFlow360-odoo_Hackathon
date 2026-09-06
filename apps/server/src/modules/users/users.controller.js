import usersService from './users.service.js';
import { successResponse } from '../../utils/apiResponse.util.js';

export const getUsers = async (req, res, next) => {
  try {
    const result = await usersService.getAll();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const getUsersById = async (req, res, next) => {
  try {
    const result = await usersService.getById(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const provisionUser = async (req, res, next) => {
  try {
    const result = await usersService.provisionUser(req.body);
    return successResponse(res, result, null, 201);
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const result = await usersService.getProfile(userId, req.user);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id || req.body?.id || req.params?.id;
    const result = await usersService.updateProfile(userId, req.body, req.user);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

