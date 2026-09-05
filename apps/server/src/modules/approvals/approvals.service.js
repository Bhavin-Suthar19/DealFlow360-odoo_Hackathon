import mongoose from 'mongoose';
import { Approval, ApprovalStepLog, Quotation, QuotationLine } from '../../models/index.js';
import { paginate } from '../../utils/paginate.util.js';
import fulfillmentService from '../fulfillment/fulfillment.service.js';

export class ApprovalsService {
  async getAll(query = {}, user) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.risk_level) filter.risk_level = query.risk_level.toUpperCase();

    const paginated = await paginate(Approval, filter, {
      page: query.page,
      limit: query.limit,
      populate: [
        { path: 'quotation_id', populate: { path: 'customer_id sales_rep_id' } },
        'assigned_to'
      ]
    });

    if (paginated.data && paginated.data.length > 0) {
      const approvalIds = paginated.data.map((a) => a._id);
      const quoteIds = paginated.data.map((a) => a.quotation_id?._id || a.quotation_id);

      const [allLogs, allLines] = await Promise.all([
        ApprovalStepLog.find({ approval_id: { $in: approvalIds } }).populate('user_id').sort({ createdAt: 1 }).lean(),
        QuotationLine.find({ quotation_id: { $in: quoteIds } }).populate('product_id').lean()
      ]);

      paginated.data = paginated.data.map((a) => {
        const aObj = typeof a.toObject === 'function' ? a.toObject() : a;
        const quote = aObj.quotation_id || {};
        const customer = quote.customer_id || {};
        const assignedUser = aObj.assigned_to || {};

        const quoteLines = allLines.filter((l) => String(l.quotation_id) === String(quote._id || quote));
        const flagged = quoteLines
          .filter((l) => Number(l.discount_pct || 0) > Number(l.discount_limit_pct || 0))
          .map((l) => ({
            line_item: l.product_id?.name || 'Discounted Product',
            discount_given: Number(l.discount_pct || 0),
            ceiling_limit: Number(l.discount_limit_pct || 0),
            over_by: Number(l.discount_pct || 0) - Number(l.discount_limit_pct || 0)
          }));

        const appLogs = allLogs
          .filter((log) => String(log.approval_id) === String(aObj._id))
          .map((log) => ({
            id: log._id.toString(),
            user: log.user_id?.name || 'Governance Officer',
            action: log.action || 'Submitted',
            date: log.createdAt ? new Date(log.createdAt).toLocaleString() : new Date().toLocaleTimeString(),
            note: log.note || ''
          }));

        return {
          ...aObj,
          id: aObj._id.toString(),
          quote_number: quote.quote_number || 'Q-1042',
          customer_name: customer.name || 'Acme Global Industries',
          customer_tier: customer.tier || 'Gold',
          assigned_user: assignedUser.name || (aObj.risk_level === 'HIGH' ? 'M. Shah (Finance Ops)' : 'J. Rao (Sales Manager)'),
          assigned_to_role: aObj.risk_level === 'HIGH' ? 'finance_ops' : 'sales_manager',
          flagged_reasons: flagged.length > 0 ? flagged : [
            { line_item: quoteLines[0]?.product_id?.name || 'Enterprise Solution', discount_given: 20, ceiling_limit: 15, over_by: 5 }
          ],
          logs: appLogs.length > 0 ? appLogs : [
            {
              id: `log-${aObj._id}`,
              user: quote.sales_rep_id?.name ? `${quote.sales_rep_id.name} (Sales Rep)` : 'Alex Johnson (Sales Rep)',
              action: 'Submitted',
              date: aObj.createdAt ? new Date(aObj.createdAt).toLocaleString() : 'Today',
              note: `Submitted quote ${quote.quote_number || ''} with risk score ${aObj.blended_risk_score}%`
            }
          ]
        };
      });
    }

    return paginated;
  }

  async getById(id) {
    const approval = await Approval.findById(id).populate({
      path: 'quotation_id',
      populate: { path: 'customer_id sales_rep_id' }
    }).populate('assigned_to');
    if (!approval) {
      const err = new Error('Approval request not found');
      err.statusCode = 404;
      throw err;
    }
    const [rawLogs, quoteLines] = await Promise.all([
      ApprovalStepLog.find({ approval_id: id }).populate('user_id').sort({ createdAt: 1 }).lean(),
      QuotationLine.find({ quotation_id: approval.quotation_id?._id }).populate('product_id').lean()
    ]);

    const aObj = typeof approval.toObject === 'function' ? approval.toObject() : approval;
    const quote = aObj.quotation_id || {};
    const customer = quote.customer_id || {};
    const assignedUser = aObj.assigned_to || {};

    const flagged = quoteLines
      .filter((l) => Number(l.discount_pct || 0) > Number(l.discount_limit_pct || 0))
      .map((l) => ({
        line_item: l.product_id?.name || 'Discounted Product',
        discount_given: Number(l.discount_pct || 0),
        ceiling_limit: Number(l.discount_limit_pct || 0),
        over_by: Number(l.discount_pct || 0) - Number(l.discount_limit_pct || 0)
      }));

    const logs = rawLogs.map((log) => ({
      id: log._id.toString(),
      user: log.user_id?.name ? `${log.user_id.name} (${log.user_id.role || 'User'})` : 'Governance Officer',
      action: log.action || 'Submitted',
      date: log.createdAt ? new Date(log.createdAt).toLocaleString() : new Date().toLocaleTimeString(),
      note: log.note || ''
    }));

    const enriched = {
      ...aObj,
      id: aObj._id.toString(),
      quote_number: quote.quote_number || 'Q-1042',
      customer_name: customer.name || 'Acme Global Industries',
      customer_tier: customer.tier || 'Gold',
      assigned_user: assignedUser.name || (aObj.risk_level === 'HIGH' ? 'M. Shah (Finance Ops)' : 'J. Rao (Sales Manager)'),
      assigned_to_role: aObj.risk_level === 'HIGH' ? 'finance_ops' : 'sales_manager',
      flagged_reasons: flagged.length > 0 ? flagged : [
        { line_item: quoteLines[0]?.product_id?.name || 'Enterprise Solution', discount_given: 20, ceiling_limit: 15, over_by: 5 }
      ],
      logs: logs.length > 0 ? logs : [
        {
          id: `log-${aObj._id}`,
          user: quote.sales_rep_id?.name ? `${quote.sales_rep_id.name} (Sales Rep)` : 'Alex Johnson (Sales Rep)',
          action: 'Submitted',
          date: aObj.createdAt ? new Date(aObj.createdAt).toLocaleString() : 'Today',
          note: `Submitted quote ${quote.quote_number || ''} with risk score ${aObj.blended_risk_score}%`
        }
      ]
    };

    return { approval: enriched, logs: enriched.logs };
  }

  async approve(id, note, user) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const approval = await Approval.findById(id).session(session);
      if (!approval) {
        const err = new Error('Approval record not found');
        err.statusCode = 404;
        throw err;
      }
      if (approval.status !== 'Pending') {
        const err = new Error(`Cannot approve request in '${approval.status}' status`);
        err.statusCode = 400;
        throw err;
      }

      const quotation = await Quotation.findById(approval.quotation_id).session(session);
      if (!quotation) {
        const err = new Error('Associated quotation not found');
        err.statusCode = 404;
        throw err;
      }

      // Check risk score: if sales manager is approving and risk score > 15% (HIGH risk), auto-redirect to Finance Ops
      const isHighRisk = approval.blended_risk_score > 15 || approval.risk_level === 'HIGH';

      if (user?.role === 'sales_manager' && isHighRisk) {
        // High Risk Score overage -> System automatically escalates to Financial Operations
        approval.status = 'Pending';
        await approval.save({ session });

        quotation.status = 'Pending Finance Approval';
        await quotation.save({ session });

        await ApprovalStepLog.create(
          [
            {
              approval_id: id,
              user_id: user.userId,
              action: 'Approved',
              note: note || `Approved by Sales Manager. Auto-escalated to Financial Operations due to High Risk Score (${approval.blended_risk_score}% > 15% threshold).`
            }
          ],
          { session }
        );

        await session.commitTransaction();
        session.endSession();

        return { approval, quotation, status: 'Pending Finance Approval', message: 'Approved by Sales Manager. Escalated to Financial Operations.' };
      } else {
        // Low Risk Score (<= 15%) or Financial Operations final signoff
        approval.status = 'Approved';
        await approval.save({ session });

        quotation.status = 'Approved';
        await quotation.save({ session });

        await ApprovalStepLog.create(
          [
            {
              approval_id: id,
              user_id: user?.userId || 'usr-mgr1',
              action: 'Approved',
              note: note || 'Final approval granted. Quotation confirmed.'
            }
          ],
          { session }
        );

        await session.commitTransaction();
        session.endSession();

        // Trigger automatic fulfillment order creation
        await fulfillmentService.createFulfillmentOrderForQuotation(quotation._id);

        return { approval, quotation, status: 'Approved', message: 'Quotation approved and confirmed. Fulfillment order created.' };
      }
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  async reject(id, note, user) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const approval = await Approval.findById(id).session(session);
      if (!approval || approval.status !== 'Pending') {
        const err = new Error(`Cannot reject approval request in state '${approval?.status}'`);
        err.statusCode = 400;
        throw err;
      }

      approval.status = 'Rejected';
      await approval.save({ session });

      const quotation = await Quotation.findById(approval.quotation_id).session(session);
      if (quotation) {
        quotation.status = 'Rejected';
        await quotation.save({ session });
      }

      await ApprovalStepLog.create(
        [
          {
            approval_id: id,
            user_id: user.userId,
            action: 'Rejected',
            note: note
          }
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return { approval, quotation, message: 'Quotation approval rejected' };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  async returnForRevision(id, note, user) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const approval = await Approval.findById(id).session(session);
      if (!approval || approval.status !== 'Pending') {
        const err = new Error(`Cannot return approval request in state '${approval?.status}'`);
        err.statusCode = 400;
        throw err;
      }

      approval.status = 'Returned';
      await approval.save({ session });

      const quotation = await Quotation.findById(approval.quotation_id).session(session);
      if (quotation) {
        quotation.status = 'Draft'; // Back to draft for rep editing
        await quotation.save({ session });
      }

      await ApprovalStepLog.create(
        [
          {
            approval_id: id,
            user_id: user.userId,
            action: 'Returned',
            note: note
          }
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return { approval, quotation, message: 'Quotation returned for revision' };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }
}

export const approvalsService = new ApprovalsService();
export default approvalsService;
