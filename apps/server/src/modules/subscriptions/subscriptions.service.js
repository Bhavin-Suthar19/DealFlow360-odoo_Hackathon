import {
  SubscriptionPlan,
  Subscription,
  BillingSchedule,
  CreditNote,
  Customer
} from '../../models/index.js';
import { calculateProration } from '../../utils/proration.util.js';
import { paginate } from '../../utils/paginate.util.js';

export class SubscriptionsService {
  async getPlans() {
    return SubscriptionPlan.find();
  }

  async createPlan(data) {
    return SubscriptionPlan.create(data);
  }

  async getAll(query = {}) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.customer_id) filter.customer_id = query.customer_id;

    return paginate(Subscription, filter, {
      page: query.page,
      limit: query.limit,
      populate: ['customer_id', 'plan_id', 'quotation_id']
    });
  }

  async create(data) {
    const plan = await SubscriptionPlan.findById(data.plan_id);
    if (!plan) {
      const err = new Error('Subscription plan not found');
      err.statusCode = 404;
      throw err;
    }

    const customer = await Customer.findById(data.customer_id);
    if (!customer) {
      const err = new Error('Customer not found');
      err.statusCode = 404;
      throw err;
    }

    const next_bill_date = new Date();
    if (plan.cycle === 'monthly') next_bill_date.setMonth(next_bill_date.getMonth() + 1);
    else if (plan.cycle === 'quarterly') next_bill_date.setMonth(next_bill_date.getMonth() + 3);
    else if (plan.cycle === 'yearly') next_bill_date.setFullYear(next_bill_date.getFullYear() + 1);

    const subscription = await Subscription.create({
      customer_id: data.customer_id,
      plan_id: data.plan_id,
      quotation_id: data.quotation_id,
      status: 'Active',
      amount: data.amount,
      next_bill_date
    });

    // Create billing schedule
    await BillingSchedule.create({
      subscription_id: subscription._id,
      bill_date: next_bill_date,
      amount: data.amount,
      status: 'Unpaid'
    });

    return subscription;
  }

  async cancel(id, reason = 'Customer requested cancellation') {
    const subscription = await Subscription.findById(id).populate('plan_id');
    if (!subscription) {
      const err = new Error('Subscription not found');
      err.statusCode = 404;
      throw err;
    }

    if (subscription.status === 'Cancelled') {
      const err = new Error('Subscription is already cancelled');
      err.statusCode = 400;
      throw err;
    }

    // Calculate proration / credit amount
    const planCycle = subscription.plan_id ? subscription.plan_id.cycle : 'monthly';
    const { proratedAmount } = calculateProration({
      cycle: planCycle,
      changeDate: new Date(),
      cycleStartDate: subscription.createdAt || new Date(),
      oldQty: 1,
      newQty: 0,
      unitPrice: subscription.amount
    });

    subscription.status = 'Cancelled';
    await subscription.save();

    let creditNote = null;
    if (proratedAmount < 0) {
      creditNote = await CreditNote.create({
        subscription_id: subscription._id,
        amount: Math.abs(proratedAmount),
        reason: `Prorated refund for cancellation: ${reason}`
      });
    }

    return { subscription, creditNote, proratedAmount };
  }

  async getBillingSchedule(subscriptionId) {
    return BillingSchedule.find({ subscription_id: subscriptionId }).sort({ bill_date: 1 });
  }
}

export const subscriptionsService = new SubscriptionsService();
export default subscriptionsService;
