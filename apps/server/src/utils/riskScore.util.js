/**
 * Blended Discount Risk Score Calculator (Pure Function)
 *
 * Computes a weighted risk score across all quotation lines and maps it to a risk level.
 * Formula:
 *  For each line: overage = max(0, discount_pct - discount_limit_pct)
 *  Weighted sum = sum(overage * (qty * unit_price))
 *  Total amount = sum(qty * unit_price)
 *  Blended Risk Score = weighted_sum / total_amount (rounded to 2 decimal places)
 */

export const calculateBlendedRiskScore = (lines = [], rules = []) => {
  if (!lines || lines.length === 0) {
    return { blended_risk_score: 0, risk_level: 'low' };
  }

  let totalWeight = 0;
  let weightedOverageSum = 0;

  lines.forEach((line) => {
    const qty = Number(line.qty || 1);
    const unitPrice = Number(line.unit_price || 0);
    const discountPct = Number(line.discount_pct || 0);
    const discountLimitPct = Number(line.discount_limit_pct || 0);

    const lineWeight = qty * unitPrice;
    const overage = Math.max(0, discountPct - discountLimitPct);

    totalWeight += lineWeight;
    weightedOverageSum += overage * lineWeight;
  });

  const blended_risk_score = totalWeight > 0 
    ? Number((weightedOverageSum / totalWeight).toFixed(2))
    : 0;

  let risk_level = 'low';

  if (rules && rules.length > 0) {
    // Sorted ascending by min_discount_pct
    const sortedRules = [...rules].sort((a, b) => Number(a.min_discount_pct) - Number(b.min_discount_pct));
    for (const rule of sortedRules) {
      const min = Number(rule.min_discount_pct);
      const max = Number(rule.max_discount_pct);
      if (blended_risk_score >= min && blended_risk_score <= max) {
        risk_level = rule.risk_level;
        break;
      }
    }
    // If score exceeds all rule ranges, assign highest risk level
    if (blended_risk_score > Number(sortedRules[sortedRules.length - 1].max_discount_pct)) {
      risk_level = 'high';
    }
  } else {
    // Default fallback ranges if no DB rules defined yet
    if (blended_risk_score === 0) {
      risk_level = 'low';
    } else if (blended_risk_score <= 10) {
      risk_level = 'medium';
    } else {
      risk_level = 'high';
    }
  }

  return { blended_risk_score, risk_level };
};

export default calculateBlendedRiskScore;
