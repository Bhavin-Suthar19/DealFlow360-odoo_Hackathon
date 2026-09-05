// Centralized DealFlow360 Database Model Registry (26 Models across 10 Domain Modules)

// Module 1 — Identity & Access
export { User } from '../modules/users/users.model.js';
export { Team } from '../modules/users/teams.model.js';
export { Customer } from '../modules/customers/customers.model.js';
export { CustomerUser } from '../modules/customers/customer-users.model.js';

// Module 2 — Product & Pricing
export { Category } from '../modules/products/categories.model.js';
export { Product } from '../modules/products/products.model.js';
export { ProductVariant } from '../modules/products/product-variants.model.js';
export { PriceList } from '../modules/price-lists/price-lists.model.js';
export { PriceListItem } from '../modules/price-lists/price-list-items.model.js';

// Module 3 — Discount Governance
export { DiscountTier } from '../modules/discount-tiers/discount-tiers.model.js';
export { CategoryDiscountCeiling } from '../modules/discount-tiers/category-discount-ceilings.model.js';
export { ApprovalChainRule } from '../modules/approval-chains/approval-chain-rules.model.js';
export { ApprovalChainStep } from '../modules/approval-chains/approval-chain-steps.model.js';

// Module 4 — Warehouse & Fulfillment
export { Warehouse } from '../modules/warehouses/warehouses.model.js';
export { WarehouseStock } from '../modules/warehouses/warehouse-stock.model.js';
export { FulfillmentOrder } from '../modules/fulfillment/fulfillment-orders.model.js';
export { FulfillmentSplit } from '../modules/fulfillment/fulfillment-splits.model.js';
export { Backorder } from '../modules/fulfillment/backorders.model.js';

// Module 5 — Subscriptions & Billing
export { SubscriptionPlan } from '../modules/subscriptions/subscription-plans.model.js';
export { Subscription } from '../modules/subscriptions/subscriptions.model.js';
export { BillingSchedule } from '../modules/subscriptions/billing-schedule.model.js';
export { CreditNote } from '../modules/billing/credit-notes.model.js';

// Module 6 — Upsell / Cross-sell Engine
export { UpsellRule } from '../modules/upsell/upsell-rules.model.js';

// Module 7 — Quotations
export { Quotation } from '../modules/quotations/quotations.model.js';
export { QuotationLine } from '../modules/quotations/quotation-lines.model.js';
export { QuotationRequest } from '../modules/quotations/quotation-requests.model.js';
export { QuotationNegotiationRequest } from '../modules/negotiation/quotation-negotiation-requests.model.js';

// Module 8 — Approvals
export { Approval } from '../modules/approvals/approvals.model.js';
export { ApprovalStepLog } from '../modules/approvals/approval-steps-log.model.js';

// Module 9 — Invoicing & Payments
export { Invoice } from '../modules/billing/invoices.model.js';
export { InvoiceLine } from '../modules/billing/invoice-lines.model.js';
export { Payment } from '../modules/billing/payments.model.js';

// Module 10 — Deal Health & Audit
export { DealHealthAlert } from '../modules/dashboard/deal-health-alerts.model.js';
export { AuditLog } from '../modules/audit/audit-log.model.js';
