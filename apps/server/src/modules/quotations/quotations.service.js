import mongoose from 'mongoose';
import {
  Quotation,
  QuotationLine,
  QuotationRequest,
  Customer,
  Product,
  CategoryDiscountCeiling,
  DiscountTier,
  ApprovalChainRule,
  ApprovalChainStep,
  Approval,
  ApprovalStepLog,
  User
} from '../../models/index.js';
import { calculateBlendedRiskScore } from '../../utils/riskScore.util.js';
import { paginate } from '../../utils/paginate.util.js';
import fulfillmentService from '../fulfillment/fulfillment.service.js';

export class QuotationsService {
  async getAll(query = {}, user = {}) {
    const filter = {};
    if (user.role === 'sales_rep') {
      filter.sales_rep_id = user.userId;
    }
    if (query.status) filter.status = query.status;
    if (query.customer_id) filter.customer_id = query.customer_id;

    return paginate(Quotation, filter, {
      page: query.page,
      limit: query.limit,
      populate: ['customer_id', 'sales_rep_id']
    });
  }

  async getById(id) {
    const quotation = await Quotation.findById(id).populate('customer_id sales_rep_id');
    if (!quotation) {
      const err = new Error('Quotation not found');
      err.statusCode = 404;
      throw err;
    }
    const lines = await QuotationLine.find({ quotation_id: id }).populate('product_id');
    return { quotation, lines };
  }

  async create(data, user) {
    const customer = await Customer.findById(data.customer_id);
    if (!customer) {
      const err = new Error('Customer not found');
      err.statusCode = 404;
      throw err;
    }

    const count = await Quotation.countDocuments();
    const quote_number = `Q-${1040 + count + 1}`;

    const quotation = await Quotation.create({
      quote_number,
      customer_id: data.customer_id,
      sales_rep_id: user?.userId || data.sales_rep_id || 'usr-sales1',
      status: 'Draft',
      blended_risk_score: 0,
      total_amount: 0
    });

    return quotation;
  }

  async createRFQ(data, customerUser) {
    const count = await QuotationRequest.countDocuments();
    const rfq_number = `RFQ-${2000 + count + 1}`;

    // Find assigned sales rep or pick first sales rep
    let salesRepId = customerUser?.salesRepId;
    if (!salesRepId) {
      const salesRep = await User.findOne({ role: 'sales_rep' });
      salesRepId = salesRep?._id || 'usr-sales1';
    }

    const rfq = await QuotationRequest.create({
      rfq_number,
      customer_id: customerUser?.customerId || data.customer_id,
      requested_by: customerUser?.customerUserId || null,
      assigned_sales_rep_id: salesRepId,
      items: data.items || [],
      customer_notes: data.customer_notes || '',
      target_delivery_date: data.target_delivery_date ? new Date(data.target_delivery_date) : null,
      status: 'Submitted'
    });

    // Automatically create linked Quotation with status 'RFQ Received'
    const quoteCount = await Quotation.countDocuments();
    const quote_number = `Q-${1040 + quoteCount + 1}`;

    const quotation = await Quotation.create({
      quote_number,
      rfq_id: rfq._id,
      customer_id: rfq.customer_id,
      sales_rep_id: salesRepId,
      status: 'RFQ Received',
      blended_risk_score: 0,
      total_amount: 0
    });

    // Populate initial lines from RFQ items
    if (Array.isArray(data.items)) {
      for (const item of data.items) {
        const product = await Product.findById(item.product_id);
        if (product) {
          await QuotationLine.create({
            quotation_id: quotation._id,
            product_id: product._id,
            qty: item.requested_qty || 1,
            unit_price: product.list_price || product.price || 1000,
            discount_pct: 0,
            discount_limit_pct: 15,
            line_type: product.is_subscription ? 'recurring' : 'one_time'
          });
        }
      }
      await this.recalculateTotal(quotation._id);
    }

    return { rfq, quotation };
  }

  async getRFQs(query = {}, user = {}) {
    const filter = {};
    if (user.role === 'customer') {
      filter.customer_id = user.customerId;
    } else if (user.role === 'sales_rep') {
      filter.assigned_sales_rep_id = user.userId;
    }
    if (query.status) filter.status = query.status;

    return paginate(QuotationRequest, filter, {
      page: query.page,
      limit: query.limit,
      populate: ['customer_id', 'requested_by', 'assigned_sales_rep_id', 'items.product_id']
    });
  }

  async sendToCustomer(quotationId, user) {
    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      const err = new Error('Quotation not found');
      err.statusCode = 404;
      throw err;
    }

    const lines = await QuotationLine.find({ quotation_id: quotationId });
    if (!lines || lines.length === 0) {
      const err = new Error('Cannot send empty quotation to customer');
      err.statusCode = 400;
      throw err;
    }

    quotation.status = 'Pending Customer Approval';
    await quotation.save();
    return quotation;
  }

  async escalateToManager(quotationId, note = '', user) {
    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      const err = new Error('Quotation not found');
      err.statusCode = 404;
      throw err;
    }

    const lines = await QuotationLine.find({ quotation_id: quotationId });
    const rules = await ApprovalChainRule.find();
    const { blended_risk_score, risk_level } = calculateBlendedRiskScore(lines, rules);

    quotation.blended_risk_score = blended_risk_score;
    quotation.status = 'Pending Manager Approval';
    await quotation.save();

    const managerUser = await User.findOne({ role: 'sales_manager' });

    const approval = await Approval.create({
      quotation_id: quotationId,
      risk_level: risk_level.toUpperCase(),
      blended_risk_score,
      status: 'Pending',
      assigned_to: managerUser?._id || user?.userId || 'usr-mgr1'
    });

    await ApprovalStepLog.create({
      approval_id: approval._id,
      user_id: user?.userId || 'usr-sales1',
      action: 'Submitted',
      note: note || `Escalated by Sales Rep to Sales Manager for negotiation approval. (Risk Score: ${blended_risk_score}%)`
    });

    return { quotation, approval };
  }

  async addLine(quotationId, data, user) {
    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      const err = new Error('Quotation not found');
      err.statusCode = 404;
      throw err;
    }
    if (!['Draft', 'RFQ Received', 'Under Negotiation'].includes(quotation.status)) {
      const err = new Error(`Cannot modify quote lines in '${quotation.status}' state`);
      err.statusCode = 400;
      throw err;
    }

    const product = await Product.findById(data.product_id);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }

    let discount_limit_pct = 15;

    const categoryCeiling = await CategoryDiscountCeiling.findOne({ category_id: product.category_id });
    if (categoryCeiling) {
      discount_limit_pct = Number(categoryCeiling.max_discount_pct);
    } else {
      const customer = await Customer.findById(quotation.customer_id);
      if (customer) {
        const tierConfig = await DiscountTier.findOne({ tier_name: customer.tier });
        if (tierConfig) {
          discount_limit_pct = Number(tierConfig.max_discount_pct);
        }
      }
    }

    const line = await QuotationLine.create({
      quotation_id: quotationId,
      product_id: data.product_id,
      qty: data.qty,
      unit_price: data.unit_price || product.list_price || 1000,
      discount_pct: data.discount_pct || 0,
      discount_limit_pct,
      line_type: data.line_type || (product.is_subscription ? 'recurring' : 'one_time'),
      is_upsell: data.is_upsell || false
    });

    await this.recalculateTotal(quotationId);
    return line;
  }

  async updateLine(quotationId, lineId, data) {
    const quotation = await Quotation.findById(quotationId);
    if (!quotation || !['Draft', 'RFQ Received', 'Under Negotiation'].includes(quotation.status)) {
      const err = new Error(`Cannot modify quote lines when quote is in '${quotation?.status}' state`);
      err.statusCode = 400;
      throw err;
    }
    const line = await QuotationLine.findById(lineId);
    if (!line) {
      const err = new Error('Quotation line not found');
      err.statusCode = 404;
      throw err;
    }

    Object.assign(line, data);
    await line.save();
    await this.recalculateTotal(quotationId);
    return line;
  }

  async deleteLine(quotationId, lineId) {
    const quotation = await Quotation.findById(quotationId);
    if (!quotation || !['Draft', 'RFQ Received', 'Under Negotiation'].includes(quotation.status)) {
      const err = new Error(`Cannot modify quote lines when quote is in '${quotation?.status}' state`);
      err.statusCode = 400;
      throw err;
    }
    await QuotationLine.deleteOne({ _id: lineId, quotation_id: quotationId });
    await this.recalculateTotal(quotationId);
    return { message: 'Line deleted' };
  }

  async recalculateTotal(quotationId) {
    const lines = await QuotationLine.find({ quotation_id: quotationId });
    let total = 0;
    lines.forEach((l) => {
      const lineSubtotal = l.qty * l.unit_price * (1 - l.discount_pct / 100);
      total += lineSubtotal;
    });
    await Quotation.findByIdAndUpdate(quotationId, { total_amount: Number(total.toFixed(2)) });
  }

  async submitQuotation(quotationId, user) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const quotation = await Quotation.findById(quotationId).session(session);
      if (!quotation) {
        const err = new Error('Quotation not found');
        err.statusCode = 404;
        throw err;
      }

      const lines = await QuotationLine.find({ quotation_id: quotationId }).session(session);
      if (!lines || lines.length === 0) {
        const err = new Error('Cannot submit quotation with no lines');
        err.statusCode = 400;
        throw err;
      }

      const rules = await ApprovalChainRule.find().session(session);
      const { blended_risk_score, risk_level } = calculateBlendedRiskScore(lines, rules);

      quotation.blended_risk_score = blended_risk_score;

      if (risk_level === 'low') {
        quotation.status = 'Approved';
        await quotation.save({ session });

        await session.commitTransaction();
        session.endSession();

        await fulfillmentService.createFulfillmentOrderForQuotation(quotationId);

        return { quotation, status: 'Approved', risk_level, blended_risk_score };
      } else {
        quotation.status = 'Pending Manager Approval';
        await quotation.save({ session });

        const approval = await Approval.create(
          [
            {
              quotation_id: quotationId,
              risk_level: risk_level.toUpperCase(),
              blended_risk_score,
              status: 'Pending',
              assigned_to: user?.userId || 'usr-mgr1'
            }
          ],
          { session }
        );

        await ApprovalStepLog.create(
          [
            {
              approval_id: approval[0]._id,
              user_id: user?.userId || 'usr-sales1',
              action: 'Submitted',
              note: `Quote submitted with risk level ${risk_level.toUpperCase()} (Score: ${blended_risk_score}%)`
            }
          ],
          { session }
        );

        await session.commitTransaction();
        session.endSession();

        return { quotation, approval: approval[0], status: 'Pending Manager Approval', risk_level, blended_risk_score };
      }
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}

export const quotationsService = new QuotationsService();
export default quotationsService;
