import bcrypt from 'bcryptjs';
import { User, CustomerUser } from '../../models/index.js';

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

  async getProfile(userId, userContext = {}) {
    // 1. Check if customer user context
    if (userContext.tokenType === 'portal' || userContext.role === 'customer') {
      let custUser = null;
      if (userId) custUser = await CustomerUser.findById(userId);
      if (!custUser && userContext.customerId) {
        custUser = await CustomerUser.findOne({ customer_id: userContext.customerId });
      }
      if (!custUser && userContext.email) {
        custUser = await CustomerUser.findOne({ email: userContext.email.toLowerCase().trim() });
      }
      if (custUser) {
        const { Customer } = await import('../../models/index.js');
        const customerOrg = custUser.customer_id ? await Customer.findById(custUser.customer_id) : null;
        return {
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
        };
      }
    }

    // 2. Standard internal staff user
    let user = null;
    if (userId) {
      user = await User.findById(userId).select('-password_hash');
    }
    if (!user && userContext.email) {
      user = await User.findOne({ email: userContext.email.toLowerCase().trim() }).select('-password_hash');
    }
    if (user) {
      return {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || '',
        phone: user.phone || '',
        team_id: user.team_id
      };
    }

    // 3. Fallback to customer user
    const fallbackCust = await CustomerUser.findById(userId);
    if (fallbackCust) {
      const { Customer } = await import('../../models/index.js');
      const customerOrg = fallbackCust.customer_id ? await Customer.findById(fallbackCust.customer_id) : null;
      return {
        id: fallbackCust._id,
        _id: fallbackCust._id,
        name: fallbackCust.name,
        email: fallbackCust.email,
        phone: fallbackCust.phone || '',
        role: 'customer',
        customer_id: fallbackCust.customer_id,
        company_name: customerOrg?.name || fallbackCust.name,
        tier: customerOrg?.tier || 'Silver',
        currency: customerOrg?.currency || 'USD',
        department: 'Customer Organization'
      };
    }

    const err = new Error('Profile not found');
    err.statusCode = 404;
    throw err;
  }

  async updateProfile(userId, data, userContext = {}) {
    // Check if customer user context
    if (userContext.tokenType === 'portal' || userContext.role === 'customer' || data.role === 'customer') {
      let custUser = await CustomerUser.findById(userId);
      if (!custUser && data.email) {
        custUser = await CustomerUser.findOne({ email: data.email.toLowerCase().trim() });
      }
      if (custUser) {
        if (data.name) custUser.name = data.name.trim();
        if (data.email) custUser.email = data.email.toLowerCase().trim();
        if (data.phone !== undefined) custUser.phone = data.phone.trim();
        if (data.password) {
          custUser.password_hash = await bcrypt.hash(data.password, 12);
        }
        await custUser.save();

        const { Customer } = await import('../../models/index.js');
        let customerOrg = custUser.customer_id ? await Customer.findById(custUser.customer_id) : null;
        if (customerOrg && data.company_name) {
          customerOrg.name = data.company_name.trim();
          await customerOrg.save();
        }

        return {
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
        };
      }
    }

    // Otherwise standard internal user
    let user = await User.findById(userId);
    if (!user && data.email) {
      user = await User.findOne({ email: data.email.toLowerCase().trim() });
    }
    if (!user) {
      // Fallback check on CustomerUser
      const fallbackCust = await CustomerUser.findOne({ email: data.email?.toLowerCase().trim() });
      if (fallbackCust) {
        if (data.name) fallbackCust.name = data.name.trim();
        await fallbackCust.save();
        return {
          id: fallbackCust._id,
          _id: fallbackCust._id,
          name: fallbackCust.name,
          email: fallbackCust.email,
          role: 'customer'
        };
      }
      const err = new Error('User account not found');
      err.statusCode = 404;
      throw err;
    }

    if (data.email && data.email.toLowerCase().trim() !== user.email) {
      const existing = await User.findOne({ email: data.email.toLowerCase().trim() });
      if (existing && existing._id.toString() !== user._id.toString()) {
        const err = new Error('Another user already exists with this email address');
        err.statusCode = 400;
        throw err;
      }
      user.email = data.email.toLowerCase().trim();
    }

    if (data.name) user.name = data.name.trim();
    if (data.password) {
      user.password_hash = await bcrypt.hash(data.password, 12);
    }
    if (data.department !== undefined) {
      user.department = data.department;
    }
    if (data.phone !== undefined) {
      user.phone = data.phone;
    }

    await user.save();

    return {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      team_id: user.team_id,
      department: user.department || '',
      phone: user.phone || ''
    };
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
