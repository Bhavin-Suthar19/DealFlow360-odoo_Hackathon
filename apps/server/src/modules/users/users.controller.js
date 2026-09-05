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
