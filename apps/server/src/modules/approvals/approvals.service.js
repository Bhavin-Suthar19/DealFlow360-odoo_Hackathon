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

      // Check if user has finance_ops role or if this is the final step
      if (user.role === 'sales_manager' && approval.risk_level === 'HIGH') {
        // Multi-tier: Advance to Finance approval
        approval.status = 'Pending';
        await approval.save({ session });

        await ApprovalStepLog.create(
          [
            {
              approval_id: id,
              user_id: user.userId,
              action: 'Approved',
              note: `${note} (Escalated to Finance Ops for Level 2 review)`
            }
          ],
          { session }
        );

        await session.commitTransaction();
        session.endSession();

        return { approval, quotation, message: 'Approved by Manager. Escalated to Finance.' };
      } else {
        // Final approval: Confirm quote
        approval.status = 'Approved';
        await approval.save({ session });

        quotation.status = 'Approved';
        await quotation.save({ session });

        await ApprovalStepLog.create(
          [
            {
              approval_id: id,
              user_id: user.userId,
              action: 'Approved',
              note: note || 'Final approval granted'
            }
          ],
          { session }
        );

        await session.commitTransaction();
        session.endSession();

        // Trigger fulfillment
        await fulfillmentService.createFulfillmentOrderForQuotation(quotation._id);

        return { approval, quotation, message: 'Quotation approved and confirmed' };
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
