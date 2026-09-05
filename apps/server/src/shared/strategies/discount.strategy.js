export class DiscountStrategy {
  calculateDiscount(amount, tier) {
    if (tier === 'VOLUME') return amount * 0.15;
    if (tier === 'TIER_1') return amount * 0.05;
    return 0;
  }
}
