import mongoose from 'mongoose';
import {
  Quotation,
  QuotationLine,
  Customer,
  Product,
  CategoryDiscountCeiling,
  DiscountTier,
  ApprovalChainRule,
  ApprovalChainStep,
  Approval,
  ApprovalStepLog
} from '../../models/index.js';
import { calculateBlendedRiskScore } from '../../utils/riskScore.util.js';
import { paginate } from '../../utils/paginate.util.js';
import fulfillmentService from '../fulfillment/fulfillment.service.js';

export class QuotationsService {
  async getAll(query = {}, user) {
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
      sales_rep_id: user.userId,
      status: 'Draft',
      blended_risk_score: 0,
      total_amount: 0
    });

    return quotation;
  }

  async addLine(quotationId, data, user) {
    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      const err = new Error('Quotation not found');
      err.statusCode = 404;
      throw err;
    }
    if (quotation.status !== 'Draft') {
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

    // Snapshot ceiling value at write time
    let discount_limit_pct = 15; // default fallback ceiling

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
      unit_price: data.unit_price,
      discount_pct: data.discount_pct,
      discount_limit_pct, // Snapshotted!
      line_type: data.line_type || (product.is_subscription ? 'recurring' : 'one_time'),
      is_upsell: data.is_upsell || false
    });

    await this.recalculateTotal(quotationId);
    return line;
  }

  async updateLine(quotationId, lineId, data) {
    const quotation = await Quotation.findById(quotationId);
    if (!quotation || quotation.status !== 'Draft') {
      const err = new Error(`Cannot modify quote lines when quote is not in Draft state`);
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
    if (!quotation || quotation.status !== 'Draft') {
      const err = new Error(`Cannot modify quote lines when quote is not in Draft state`);
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

      if (quotation.status !== 'Draft' && quotation.status !== 'Returned') {
        const err = new Error(`Cannot submit quotation in '${quotation.status}' state`);
        err.statusCode = 400;
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
        // No approval required -> Confirm quote immediately
        quotation.status = 'Approved';
        await quotation.save({ session });

        await session.commitTransaction();
        session.endSession();

        // Trigger fulfillment order creation
        await fulfillmentService.createFulfillmentOrderForQuotation(quotationId);

        return { quotation, status: 'Approved', risk_level, blended_risk_score };
      } else {
        // Approval required -> Pending Approval state
        quotation.status = 'Pending Approval';
        await quotation.save({ session });

        // Find step order 1 rule
        const matchedRule = rules.find((r) => r.risk_level === risk_level) || rules[0];
        let assignedRole = 'sales_manager';
        if (matchedRule) {
          const step1 = await ApprovalChainStep.findOne({ rule_id: matchedRule._id, step_order: 1 }).session(session);
          if (step1) assignedRole = step1.approver_role;
        }

        const approval = await Approval.create(
          [
            {
              quotation_id: quotationId,
              risk_level: risk_level.toUpperCase(),
              blended_risk_score,
              status: 'Pending',
              assigned_to: user.userId
            }
          ],
          { session }
        );

        await ApprovalStepLog.create(
          [
            {
              approval_id: approval[0]._id,
              user_id: user.userId,
              action: 'Submitted',
              note: `Quote submitted with risk level ${risk_level.toUpperCase()} (Score: ${blended_risk_score})`
            }
          ],
          { session }
        );

        await session.commitTransaction();
        session.endSession();

        return { quotation, approval: approval[0], status: 'Pending Approval', risk_level, blended_risk_score };
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
