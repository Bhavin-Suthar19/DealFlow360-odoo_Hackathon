import { Quotation, Invoice, Approval, DealHealthAlert } from '../../models/index.js';

export class ReportsService {
  async getQuotationReport(query = {}) {
    const filter = {};
    if (query.salesRepId) filter.sales_rep_id = query.salesRepId;
    if (query.approvalStatus) filter.status = query.approvalStatus;

    if (query.period) {
      const now = new Date();
      if (query.period === '30d') {
        filter.created_at = { $gte: new Date(now.setDate(now.getDate() - 30)) };
      } else if (query.period === '90d') {
        filter.created_at = { $gte: new Date(now.setDate(now.getDate() - 90)) };
      } else if (query.period === 'year') {
        filter.created_at = { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) };
      }
    }

    const quotations = await Quotation.find(filter).populate('customer_id sales_rep_id');
    const totalQuotations = quotations.length;
    const totalRevenue = quotations.reduce((sum, q) => sum + (q.total_amount || 0), 0);
    const approvedCount = quotations.filter((q) => q.status === 'Approved' || q.status === 'Confirmed').length;
    const approvalRate = totalQuotations > 0 ? Number(((approvedCount / totalQuotations) * 100).toFixed(2)) : 0;

    return {
      summary: {
        totalQuotations,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        approvedCount,
        approvalRate
      },
      quotations
    };
  }

  async exportReport(query = {}) {
    const report = await this.getQuotationReport(query);
    const format = query.format || 'pdf';

    return {
      format,
      filename: `dealflow360_report_${Date.now()}.${format}`,
      data: report
    };
  }
}

export const reportsService = new ReportsService();
export default reportsService;
