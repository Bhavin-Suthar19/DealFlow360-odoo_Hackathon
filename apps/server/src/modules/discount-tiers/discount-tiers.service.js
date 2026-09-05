import { DiscountTier, CategoryDiscountCeiling } from '../../models/index.js';

export class DiscountTiersService {
  async getTiers() {
    return DiscountTier.find();
  }

  async createTier(data) {
    return DiscountTier.create(data);
  }

  async updateTier(id, data) {
    const tier = await DiscountTier.findById(id);
    if (!tier) {
      const err = new Error('Discount tier not found');
      err.statusCode = 404;
      throw err;
    }
    Object.assign(tier, data);
    await tier.save();
    return tier;
  }

  async getCategoryCeilings() {
    return CategoryDiscountCeiling.find().populate('category_id');
  }

  async createCategoryCeiling(data) {
    return CategoryDiscountCeiling.create(data);
  }

  async updateCategoryCeiling(id, data) {
    const ceiling = await CategoryDiscountCeiling.findById(id);
    if (!ceiling) {
      const err = new Error('Category discount ceiling not found');
      err.statusCode = 404;
      throw err;
    }
    Object.assign(ceiling, data);
    await ceiling.save();
    return ceiling;
  }
}

export const discountTiersService = new DiscountTiersService();
export default discountTiersService;
