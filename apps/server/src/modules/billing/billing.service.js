import {
  Invoice,
  InvoiceLine,
  Payment,
  Quotation,
  QuotationLine,
  CreditNote
} from '../../models/index.js';
import { paginate } from '../../utils/paginate.util.js';

export class BillingService {
  async getAllInvoices(query = {}) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.customer_id) filter.customer_id = query.customer_id;

    return paginate(Invoice, filter, {
      page: query.page,
      limit: query.limit,
      populate: ['quotation_id', 'customer_id']
    });
  }

  async getInvoiceById(id) {
    const invoice = await Invoice.findById(id).populate('quotation_id customer_id');
    if (!invoice) {
      const err = new Error('Invoice not found');
      err.statusCode = 404;
      throw err;
    }
    const lines = await InvoiceLine.find({ invoice_id: id }).populate('quotation_line_id');
    const payments = await Payment.find({ invoice_id: id }).sort({ payment_date: -1 });
    const creditNotes = await CreditNote.find({ invoice_id: id });

    return { invoice, lines, payments, creditNotes };
  }

  async generateInvoiceFromQuotation(quotationId) {
    const existing = await Invoice.findOne({ quotation_id: quotationId });
    if (existing) return existing;

    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      const err = new Error('Quotation not found');
      err.statusCode = 404;
      throw err;
    }

    const count = await Invoice.countDocuments();
    const invoice_number = `INV-${1040 + count + 1}`;

    const due_date = new Date();
    due_date.setDate(due_date.getDate() + 30); // Net 30

    const invoice = await Invoice.create({
      invoice_number,
      quotation_id: quotationId,
      customer_id: quotation.customer_id,
      amount: quotation.total_amount,
      status: 'Unpaid',
      due_date,
      payment_stage: 'Invoiced'
    });

    const quotationLines = await QuotationLine.find({ quotation_id: quotationId });
    for (const qLine of quotationLines) {
      const lineSubtotal = qLine.qty * qLine.unit_price * (1 - qLine.discount_pct / 100);
      await InvoiceLine.create({
        invoice_id: invoice._id,
        quotation_line_id: qLine._id,
        amount: Number(lineSubtotal.toFixed(2))
      });
    }

    return invoice;
  }

  async recordPayment(invoiceId, { amount_paid, method }) {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      const err = new Error('Invoice not found');
      err.statusCode = 404;
      throw err;
    }

    const payment = await Payment.create({
      invoice_id: invoiceId,
      amount_paid,
      method: method || 'bank_transfer',
      payment_date: new Date()
    });

    const payments = await Payment.find({ invoice_id: invoiceId });
    const totalPaid = payments.reduce((sum, p) => sum + p.amount_paid, 0);

    if (totalPaid >= invoice.amount) {
      invoice.status = 'Paid';
      invoice.payment_stage = 'Paid';
      await invoice.save();
    }

    return { payment, invoice };
  }
}

export const billingService = new BillingService();
export default billingService;
