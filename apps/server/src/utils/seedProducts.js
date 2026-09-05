import { Product } from '../models/index.js';
import mongoose from 'mongoose';
import logger from '../config/logger.config.js';

export const seedProducts = async () => {
  try {
    const products = [
      { _id: 'prod-1', name: 'Enterprise Edge Server X-900', category_id: 'cat-1', is_subscription: false, price: 12000 },
      { _id: 'prod-2', name: 'Cloud ERP Platform (Annual)', category_id: 'cat-2', is_subscription: true, recurring_cycle: 'yearly', price: 24000 },
      { _id: 'prod-3', name: 'Managed IT Support (SLA Tier 1)', category_id: 'cat-3', is_subscription: true, recurring_cycle: 'monthly', price: 1500 },
      { _id: 'prod-4', name: 'Cybersecurity Audit Retainer', category_id: 'cat-3', is_subscription: true, recurring_cycle: 'quarterly', price: 5000 },
      { _id: 'prod-5', name: 'Data Center Rack Space', category_id: 'cat-1', is_subscription: true, recurring_cycle: 'monthly', price: 800 }
    ];

    for (const p of products) {
      await Product.findOneAndUpdate(
        { _id: p._id },
        { name: p.name, price: p.price, is_subscription: p.is_subscription, recurring_cycle: p.recurring_cycle || null, category_id: p.category_id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    logger.info('Products seeded successfully');
  } catch (err) {
    logger.error('Error seeding products:', err.message);
  }
};
