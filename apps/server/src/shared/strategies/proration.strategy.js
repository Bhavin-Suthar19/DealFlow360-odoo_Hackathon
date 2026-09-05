export class ProrationStrategy {
  calculateProratedAmount(fullAmount, daysUsed, totalDays) {
    return (fullAmount / totalDays) * daysUsed;
  }
}
