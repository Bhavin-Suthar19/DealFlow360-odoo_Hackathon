import { DealHealthAlert, Quotation, QuotationLine } from '../../models/index.js';
import { paginate } from '../../utils/paginate.util.js';

export class DashboardService {
  async getAlerts(query = {}) {
    const filter = {};
    if (query.alert_type) filter.alert_type = query.alert_type;
    if (query.status) filter.status = query.status;

    return paginate(DealHealthAlert, filter, {
      page: query.page,
      limit: query.limit,
      populate: ['quotation_id']
    });
  }

  async escalateAlert(id, detail) {
    const alert = await DealHealthAlert.findById(id);
    if (!alert) {
      const err = new Error('Alert not found');
      err.statusCode = 404;
      throw err;
    }
    alert.status = 'Escalated';
    if (detail) alert.detail = `${alert.detail} | Escalation Note: ${detail}`;
    await alert.save();
    return alert;
  }

  async nudgeAlert(id, detail) {
    const alert = await DealHealthAlert.findById(id);
    if (!alert) {
      const err = new Error('Alert not found');
      err.statusCode = 404;
      throw err;
    }
    alert.status = 'Nudged';
    if (detail) alert.detail = `${alert.detail} | Nudge Note: ${detail}`;
    await alert.save();
    return alert;
  }

  async runDetection() {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const stalledQuotes = await Quotation.find({
      status: { $in: ['Draft', 'Pending Approval', 'Negotiation'] },
      updated_at: { $lt: sevenDaysAgo }
    });

    const createdAlerts = [];

    for (const q of stalledQuotes) {
      const existing = await DealHealthAlert.findOne({ quotation_id: q._id, alert_type: 'Stalled', status: 'Open' });
      if (!existing) {
        const alert = await DealHealthAlert.create({
          quotation_id: q._id,
          alert_type: 'Stalled',
          detail: `Quotation ${q.quote_number} has been in ${q.status} state for over 7 days without updates.`,
          flagged_at: new Date(),
          status: 'Open'
        });
        createdAlerts.push(alert);
      }
    }

    // Discount anomaly check (quotes with lines exceeding 25% discount)
    const highDiscountLines = await QuotationLine.find({ discount_pct: { $gte: 25 } });
    const quoteIds = [...new Set(highDiscountLines.map((l) => l.quotation_id))];

    for (const qId of quoteIds) {
      const existing = await DealHealthAlert.findOne({ quotation_id: qId, alert_type: 'Discount Anomaly', status: 'Open' });
      if (!existing) {
        const alert = await DealHealthAlert.create({
          quotation_id: qId,
          alert_type: 'Discount Anomaly',
          detail: `Quotation contains items with heavy discount overage (>= 25%).`,
          flagged_at: new Date(),
          status: 'Open'
        });
        createdAlerts.push(alert);
      }
    }

    return { totalStalled: stalledQuotes.length, newAlerts: createdAlerts.length, alerts: createdAlerts };
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
