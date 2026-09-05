import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import logger from '../config/logger.config.js';

export const seedDefaultUsers = async () => {
  try {
    const defaultUsers = [
      { name: 'Alex Johnson', email: 'alex.j@dealflow360.com', role: 'sales_rep', password: 'password123' },
      { name: 'J. Rao', email: 'rao@dealflow360.com', role: 'sales_manager', password: 'password123' },
      { name: 'M. Shah', email: 'shah@dealflow360.com', role: 'finance_ops', password: 'password123' },
      { name: 'Elena Rostova', email: 'elena@dealflow360.com', role: 'admin', password: 'password123' },
      { name: 'Sarah Jenkins', email: 'sarah@customer.com', role: 'customer', password: 'password123' }
    ];

    const password_hash = await bcrypt.hash('password123', 12);

    for (const u of defaultUsers) {
      await User.findOneAndUpdate(
        { email: u.email },
        { name: u.name, email: u.email, password_hash, role: u.role },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      logger.info(`Seeded/Updated default user: ${u.email} (${u.role})`);
    }
  } catch (err) {
    logger.error('Error seeding default users:', err.message);
  }
};
