import mongoose from 'mongoose';
import { Approval, ApprovalStepLog, Quotation } from '../../models/index.js';
import { paginate } from '../../utils/paginate.util.js';
import fulfillmentService from '../fulfillment/fulfillment.service.js';

export class ApprovalsService {
  async getAll(query = {}, user) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.risk_level) filter.risk_level = query.risk_level.toUpperCase();

    return paginate(Approval, filter, {
      page: query.page,
      limit: query.limit,
      populate: ['quotation_id', 'assigned_to']
    });
  }

  async getById(id) {
    const approval = await Approval.findById(id).populate('quotation_id assigned_to');
    if (!approval) {
      const err = new Error('Approval request not found');
      err.statusCode = 404;
      throw err;
    }
    const logs = await ApprovalStepLog.find({ approval_id: id }).populate('user_id').sort({ action_date: 1 });
    return { approval, logs };
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
