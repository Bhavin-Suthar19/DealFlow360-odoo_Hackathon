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

    const result = await paginate(Invoice, filter, {
      page: query.page,
      limit: query.limit,
      populate: ['quotation_id', 'customer_id']
    });

    const invoiceIds = result.data.map((i) => i._id);
    const payments = await Payment.find({ invoice_id: { $in: invoiceIds } }).sort({ payment_date: -1 });
    const paymentsByInvoice = {};
    payments.forEach((p) => {
      const invId = String(p.invoice_id);
      if (!paymentsByInvoice[invId]) paymentsByInvoice[invId] = [];
      paymentsByInvoice[invId].push(p.toObject ? p.toObject() : { ...p });
    });

    const populatedInvoices = result.data.map((inv) => {
      const invObj = inv.toObject ? inv.toObject() : { ...inv };
      const invPayments = paymentsByInvoice[String(inv._id)] || [];
      const totalPaid = invPayments.reduce((sum, p) => sum + (p.amount_paid || p.amount || 0), 0);
      const isPaid = invObj.status === 'Paid' || (totalPaid >= invObj.amount && (invObj.amount || 0) > 0);

      invObj.payments = invPayments;
      invObj.total_paid = isPaid && totalPaid === 0 ? invObj.amount : totalPaid;
      invObj.balance_due = isPaid ? 0 : Math.max(0, (invObj.amount || 0) - totalPaid);
      invObj.status = isPaid ? 'Paid' : 'Unpaid';
      invObj.quote_number = invObj.quote_number || invObj.quotation_id?.quote_number || 'Origin Quote';
      invObj.customer_name = invObj.customer_name || invObj.customer_id?.name || invObj.customer_id?.company_name || invObj.quotation_id?.customer_name || 'Enterprise Customer';
      invObj.lines = invObj.lines || [];
      return invObj;
    });

    return { ...result, data: populatedInvoices };
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

    let formattedLines = lines.map((l) => ({
      id: l._id,
      _id: l._id,
      description: l.description || l.quotation_line_id?.product_name || `Item Ref #${String(l._id).slice(-4)}`,
      amount: l.amount
    }));

    if (formattedLines.length === 0 && invoice.quotation_id) {
      const qId = invoice.quotation_id?._id || invoice.quotation_id;
      const qLines = await QuotationLine.find({ quotation_id: qId });
      if (qLines.length > 0) {
        formattedLines = qLines.map((ql) => ({
          id: ql._id,
          _id: ql._id,
          description: ql.product_name || `Catalog Line #${String(ql._id).slice(-4)}`,
          amount: Number((ql.qty * ql.unit_price * (1 - (ql.discount_pct || 0) / 100)).toFixed(2))
        }));
      } else {
        formattedLines = [
          {
            id: `line-${String(invoice._id).slice(-4)}`,
            description: `B2B Contract Settlement: ${invoice.invoice_number}`,
            amount: invoice.amount
          }
        ];
      }
    }

    const totalPaid = payments.reduce((sum, p) => sum + (p.amount_paid || p.amount || 0), 0);
    const invoiceObj = invoice.toObject ? invoice.toObject() : { ...invoice };
    const isPaid = invoiceObj.status === 'Paid' || (totalPaid >= invoiceObj.amount && (invoiceObj.amount || 0) > 0);

    invoiceObj.lines = formattedLines;
    invoiceObj.payments = payments.map((p) => (p.toObject ? p.toObject() : { ...p }));
    invoiceObj.total_paid = isPaid && totalPaid === 0 ? invoiceObj.amount : totalPaid;
    invoiceObj.balance_due = isPaid ? 0 : Math.max(0, (invoiceObj.amount || 0) - totalPaid);
    invoiceObj.status = isPaid ? 'Paid' : 'Unpaid';
    invoiceObj.quote_number = invoiceObj.quote_number || invoiceObj.quotation_id?.quote_number || 'Origin Quote';
    invoiceObj.customer_name = invoiceObj.customer_name || invoiceObj.customer_id?.name || invoiceObj.customer_id?.company_name || invoiceObj.quotation_id?.customer_name || 'Enterprise Customer';

    return { invoice: invoiceObj, lines: formattedLines, payments: invoiceObj.payments, creditNotes };
  }

  async generateInvoiceFromQuotation(quotationId) {
    const existing = await Invoice.findOne({ quotation_id: quotationId });
    if (existing) {
      return this.getInvoiceById(existing._id);
    }

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
      customer_id: quotation.customer_id?._id || quotation.customer_id,
      amount: quotation.total_amount,
      status: 'Unpaid',
      due_date,
      payment_stage: 'Invoiced'
    });

    const quotationLines = await QuotationLine.find({ quotation_id: quotationId });
    for (const qLine of quotationLines) {
      const lineSubtotal = (qLine.qty || 1) * (qLine.unit_price || 0) * (1 - (qLine.discount_pct || 0) / 100);
      await InvoiceLine.create({
        invoice_id: invoice._id,
        quotation_line_id: qLine._id,
        amount: Number(lineSubtotal.toFixed(2))
      });
    }

    return this.getInvoiceById(invoice._id);
  }

  async recordPayment(invoiceId, payload = {}) {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      const err = new Error('Invoice not found');
      err.statusCode = 404;
      throw err;
    }

    const amountPaid = Number(payload.amount_paid ?? payload.amount ?? 0);
    const method = payload.method || payload.payment_method || 'bank_transfer';

    const payment = await Payment.create({
      invoice_id: invoiceId,
      amount_paid: amountPaid,
      method,
      payment_date: new Date()
    });

    const payments = await Payment.find({ invoice_id: invoiceId });
    const totalPaid = payments.reduce((sum, p) => sum + (p.amount_paid || p.amount || 0), 0);

    if (totalPaid >= invoice.amount) {
      invoice.status = 'Paid';
      invoice.payment_stage = 'Paid';
      await invoice.save();
    }

    const fullInvoice = await this.getInvoiceById(invoiceId);
    return { payment, ...fullInvoice };
  }
}

export const billingService = new BillingService();
export default billingService;

