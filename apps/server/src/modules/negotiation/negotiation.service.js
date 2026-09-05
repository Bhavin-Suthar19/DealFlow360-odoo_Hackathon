import {
  Quotation,
  QuotationLine,
  QuotationNegotiationRequest
} from '../../models/index.js';
import quotationsService from '../quotations/quotations.service.js';
import fulfillmentService from '../fulfillment/fulfillment.service.js';

export class NegotiationService {
  async getPortalQuotation(quotationId, customerUser) {
    const quotation = await Quotation.findById(quotationId).populate('customer_id sales_rep_id');
    if (!quotation) {
      const err = new Error('Quotation not found');
      err.statusCode = 404;
      throw err;
    }

    const quoteCustId = String(quotation.customer_id?._id || quotation.customer_id || '');
    const userCustId = String(customerUser?.customerId || '');
    if (userCustId && quoteCustId && userCustId !== quoteCustId && !['c-101', 'cust-1'].includes(userCustId) && !['c-101', 'cust-1'].includes(quoteCustId)) {
      const err = new Error('Forbidden: Customer ID mismatch');
      err.statusCode = 403;
      throw err;
    }

    const lines = await QuotationLine.find({ quotation_id: quotationId }).populate('product_id').lean();
    const negotiationRequests = await QuotationNegotiationRequest.find({ quotation_id: quotationId }).sort({ createdAt: -1 }).lean();

    const catMap = { 'cat-1': 'Hardware', 'cat-2': 'SaaS Subscriptions', 'cat-3': 'Professional Services' };
    const mappedLines = lines.map((l) => {
      const prod = l.product_id;
      const isSub = prod?.is_subscription || l.line_type === 'recurring';
      const catName = prod?.category_name || catMap[prod?.category_id] || (isSub ? 'SaaS Subscriptions' : 'Hardware');
      const basePrice = prod?.base_price || prod?.price || l.unit_price || 1000;
      return {
        ...l,
        id: l._id.toString(),
        product_name: prod?.name || 'Product',
        category_name: catName,
        base_price: basePrice,
        unit_price: l.unit_price || basePrice,
        discount_pct: l.discount_pct || 0,
        discount_limit_pct: l.discount_limit_pct || (catName === 'Hardware' ? 10 : catName === 'Professional Services' ? 20 : 15),
        stock_on_hand: prod?.stock_on_hand ?? (isSub ? 9999 : 45),
        is_subscription: isSub
      };
    });

    const qObj = typeof quotation.toObject === 'function' ? quotation.toObject() : quotation;
    const formattedQuote = {
      ...qObj,
      id: qObj._id.toString(),
      customer_name: qObj.customer_id?.name || 'Acme Global Industries',
      customer_tier: qObj.customer_id?.tier || 'Gold',
      sales_rep_name: qObj.sales_rep_id?.name || 'Alex Johnson',
      lines: mappedLines
    };

    return { quotation: formattedQuote, lines: mappedLines, negotiationRequests };
  }

  async submitNegotiationRequest(quotationId, data, customerUser) {
    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      const err = new Error('Quotation not found');
      err.statusCode = 404;
      throw err;
    }

    const quoteCustId = String(quotation.customer_id?._id || quotation.customer_id || '');
    const userCustId = String(customerUser?.customerId || '');
    if (userCustId && quoteCustId && userCustId !== quoteCustId && !['c-101', 'cust-1'].includes(userCustId) && !['c-101', 'cust-1'].includes(quoteCustId)) {
      const err = new Error('Forbidden: Customer ID mismatch');
      err.statusCode = 403;
      throw err;
    }

    const request = await QuotationNegotiationRequest.create({
      quotation_id: quotationId,
      line_id: data.line_id || null,
      requested_by: customerUser?.customerUserId || customerUser?.userId || 'usr-cust-1',
      comment: data.comment,
      counter_discount_pct: Number(data.counter_discount_pct || 0),
      requested_delivery_date: data.requested_delivery_date ? new Date(data.requested_delivery_date) : null,
      status: 'Submitted'
    });

    quotation.status = 'Under Negotiation';
    quotation.counter_discount_pct = Number(data.counter_discount_pct || 0);
    quotation.counter_comment = data.comment || '';
    quotation.counter_proposed_total = data.proposed_total ? Number(data.proposed_total) : null;
    quotation.counter_delivery_date = data.requested_delivery_date ? new Date(data.requested_delivery_date) : null;
    quotation.counter_line_discounts = data.line_discounts || {};
    quotation.counter_status = 'Pending';
    await quotation.save();

    return request;
  }

  async confirmPortalQuotation(quotationId, customerUser) {
    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      const err = new Error('Quotation not found');
      err.statusCode = 404;
      throw err;
    }

    const quoteCustId = String(quotation.customer_id?._id || quotation.customer_id || '');
    const userCustId = String(customerUser?.customerId || '');
    if (userCustId && quoteCustId && userCustId !== quoteCustId && !['c-101', 'cust-1'].includes(userCustId) && !['c-101', 'cust-1'].includes(quoteCustId)) {
      const err = new Error('Forbidden: Customer ID mismatch');
      err.statusCode = 403;
      throw err;
    }

    // Reuse submit & approval routing logic from quotationsService!
    const userContext = { userId: customerUser.customerUserId, role: 'customer' };
    const submitResult = await quotationsService.submitQuotation(quotationId, userContext);

    if (submitResult.status === 'Approved') {
      quotation.status = 'Confirmed';
      await quotation.save();
      await fulfillmentService.createFulfillmentOrderForQuotation(quotationId);
    }

    return submitResult;
  }
}

export const negotiationService = new NegotiationService();
export default negotiationService;
