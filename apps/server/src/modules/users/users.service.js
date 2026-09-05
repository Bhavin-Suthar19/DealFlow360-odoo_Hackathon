import bcrypt from 'bcryptjs';
import { User } from '../../models/index.js';

export class UsersService {
  async getAll() {
    const users = await User.find().select('-password_hash');
    return users;
  }

  async getById(id) {
    const user = await User.findById(id).select('-password_hash');
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    return user;
  }

  async provisionUser(data) {
    const normEmail = data.email.toLowerCase();
    const existing = await User.findOne({ email: normEmail });
    if (existing) {
      const err = new Error('User with this email already exists');
      err.statusCode = 400;
      throw err;
    }

    const password_hash = await bcrypt.hash(data.password || 'password123', 12);
    const user = await User.create({
      name: data.name,
      email: normEmail,
      password_hash,
      role: data.role || 'sales_rep',
      team_id: data.team_id || null
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      team_id: user.team_id
    };
  }
}

export const usersService = new UsersService();
export default usersService;
