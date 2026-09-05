export class AuthService {
  async getAll() {
    return { message: 'Get all auth' };
  }

  async getById(id) {
    return { id, message: 'Get auth by ID' };
  }

  async create(data) {
    return { data, message: 'Created auth' };
  }
}

export const authService = new AuthService();
