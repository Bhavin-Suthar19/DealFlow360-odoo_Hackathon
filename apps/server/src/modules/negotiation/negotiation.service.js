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

    if (String(quotation.customer_id._id || quotation.customer_id) !== String(customerUser.customerId)) {
      const err = new Error('Forbidden: Customer ID mismatch');
      err.statusCode = 403;
      throw err;
    }

    const lines = await QuotationLine.find({ quotation_id: quotationId }).populate('product_id');
    const negotiationRequests = await QuotationNegotiationRequest.find({ quotation_id: quotationId }).sort({ createdAt: -1 });

    return { quotation, lines, negotiationRequests };
  }

  async submitNegotiationRequest(quotationId, data, customerUser) {
    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      const err = new Error('Quotation not found');
      err.statusCode = 404;
      throw err;
    }

    if (String(quotation.customer_id) !== String(customerUser.customerId)) {
      const err = new Error('Forbidden: Customer ID mismatch');
      err.statusCode = 403;
      throw err;
    }

    const request = await QuotationNegotiationRequest.create({
      quotation_id: quotationId,
      line_id: data.line_id || null,
      requested_by: customerUser.customerUserId,
      comment: data.comment,
      counter_discount_pct: data.counter_discount_pct || 0,
      requested_delivery_date: data.requested_delivery_date ? new Date(data.requested_delivery_date) : null,
      status: 'Submitted'
    });

    quotation.status = 'Negotiation';
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

    if (String(quotation.customer_id) !== String(customerUser.customerId)) {
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
