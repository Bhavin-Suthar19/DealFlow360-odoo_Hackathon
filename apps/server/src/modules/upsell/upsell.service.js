import { UpsellRule, Product } from '../../models/index.js';

export class UpsellService {
  async getRules() {
    return UpsellRule.find().populate('base_product_id suggested_product_id');
  }

  async createRule(data) {
    if (data.base_product_id === data.suggested_product_id) {
      const err = new Error('Base product and suggested product cannot be the same');
      err.statusCode = 400;
      throw err;
    }
    return UpsellRule.create(data);
  }

  async getSuggestionsForProduct(productId) {
    const rules = await UpsellRule.find({ base_product_id: productId }).populate('suggested_product_id');

    // Ranking algorithm: promoted first, then higher min_margin_pct
    const rankedRules = rules.sort((a, b) => {
      if (a.is_promoted !== b.is_promoted) {
        return a.is_promoted ? -1 : 1;
      }
      return b.min_margin_pct - a.min_margin_pct;
    });

    return rankedRules.map((r) => ({
      rule_id: r._id,
      suggested_product: r.suggested_product_id,
      min_margin_pct: r.min_margin_pct,
      is_promoted: r.is_promoted
    }));
  }
}

export const upsellService = new UpsellService();
export default upsellService;
