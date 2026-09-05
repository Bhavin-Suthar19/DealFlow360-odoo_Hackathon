/**
 * Subscription Proration Calculator (Pure Function)
 *
 * Calculates prorated charge or credit based on mid-cycle qty/plan updates or cancellation.
 * Cycles: monthly (30 days), quarterly (90 days), yearly (365 days)
 * Returns: { proratedAmount, daysRemaining, totalDaysInCycle }
 */

export const calculateProration = ({
  cycle = 'monthly',
  changeDate = new Date(),
  cycleStartDate = new Date(),
  oldQty = 1,
  newQty = 0,
  unitPrice = 0
}) => {
  const cycleDaysMap = {
    monthly: 30,
    quarterly: 90,
    yearly: 365
  };

  const totalDaysInCycle = cycleDaysMap[cycle] || 30;
  const changeMs = new Date(changeDate).getTime();
  const startMs = new Date(cycleStartDate).getTime();

  const elapsedDays = Math.max(0, Math.floor((changeMs - startMs) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, totalDaysInCycle - elapsedDays);

  const oldRatePerDay = (oldQty * unitPrice) / totalDaysInCycle;
  const newRatePerDay = (newQty * unitPrice) / totalDaysInCycle;

  const unusedOldValue = oldRatePerDay * daysRemaining;
  const newUsageValue = newRatePerDay * daysRemaining;

  const proratedAmount = Number((newUsageValue - unusedOldValue).toFixed(2));

  return {
    proratedAmount,
    daysRemaining,
    totalDaysInCycle,
    elapsedDays
  };
};

export default calculateProration;
