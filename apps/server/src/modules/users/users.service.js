export class UsersService {
  async getAll() {
    return { message: 'Get all users' };
  }

  async getById(id) {
    return { id, message: 'Get users by ID' };
  }

  async create(data) {
    return { data, message: 'Created users' };
  }
}

export const usersService = new UsersService();
