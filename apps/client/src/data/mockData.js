// DealFlow360 Centralized Mock Store Data

export const mockUsers = [
  { id: 'u-1', name: 'Alex Johnson', email: 'alex.j@dealflow360.com', role: 'sales_rep', team: 'Enterprise West' },
  { id: 'u-2', name: 'J. Rao', email: 'j.rao@dealflow360.com', role: 'sales_manager', team: 'Enterprise West' },
  { id: 'u-3', name: 'M. Shah', email: 'm.shah@dealflow360.com', role: 'finance_ops', team: 'Global Finance' },
  { id: 'u-4', name: 'Elena Rostova', email: 'elena.admin@dealflow360.com', role: 'admin', team: 'Operations' }
];

export const mockCustomers = [
  { id: 'c-101', name: 'Acme Corp', tier: 'Gold', currency: 'USD', contact: 'John Smith', email: 'john@acmecorp.com' },
  { id: 'c-102', name: 'Starlight Tech', tier: 'Silver', currency: 'USD', contact: 'Sarah Connor', email: 'sarah@starlight.io' },
  { id: 'c-103', name: 'Nexus Logistics', tier: 'Bronze', currency: 'USD', contact: 'David Lee', email: 'dlee@nexus.com' },
  { id: 'c-104', name: 'Vanguard Health', tier: 'Gold', currency: 'USD', contact: 'Dr. Rebecca Vance', email: 'rvance@vanguardhealth.org' }
];

export const mockCategories = [
  { id: 'cat-1', name: 'Hardware', default_ceiling: 10 },
  { id: 'cat-2', name: 'SaaS Subscriptions', default_ceiling: 15 },
  { id: 'cat-3', name: 'Professional Services', default_ceiling: 20 }
];

export const mockProducts = [
  {
    id: 'prod-1',
    name: 'Enterprise Edge Server X-900',
    category_id: 'cat-1',
    category_name: 'Hardware',
    unit: 'server',
    tax_pct: 8.5,
    description: 'High-density rack server with AI accelerator chips.',
    base_price: 12500,
    is_subscription: false,
    recurring_cycle: null,
    stock_on_hand: 45
  },
  {
    id: 'prod-2',
    name: 'DealFlow AI Cloud Suite',
    category_id: 'cat-2',
    category_name: 'SaaS Subscriptions',
    unit: 'seat/mo',
    tax_pct: 0,
    description: 'Autonomous CPQ and revenue pipeline orchestration engine.',
    base_price: 150,
    is_subscription: true,
    recurring_cycle: 'monthly',
    stock_on_hand: 9999
  },
  {
    id: 'prod-3',
    name: '24/7 Dedicated Support & SLA Package',
    category_id: 'cat-3',
    category_name: 'Professional Services',
    unit: 'package',
    tax_pct: 0,
    description: 'Dedicated technical account manager with 15-min emergency response SLA.',
    base_price: 3500,
    is_subscription: true,
    recurring_cycle: 'yearly',
    stock_on_hand: 9999
  },
  {
    id: 'prod-4',
    name: 'Onsite Implementation & Engineering',
    category_id: 'cat-3',
    category_name: 'Professional Services',
    unit: 'day',
    tax_pct: 0,
    description: 'Senior enterprise solution architect onsite deployment.',
    base_price: 2200,
    is_subscription: false,
    recurring_cycle: null,
    stock_on_hand: 50
  }
];

export const mockVariants = [
  { id: 'var-1', product_id: 'prod-1', attribute_name: 'RAM', attribute_value: '128GB ECC', extra_price: 1200 },
  { id: 'var-2', product_id: 'prod-1', attribute_name: 'RAM', attribute_value: '256GB ECC', extra_price: 2400 },
  { id: 'var-3', product_id: 'prod-1', attribute_name: 'Storage', attribute_value: '4TB NVMe SSD', extra_price: 1500 }
];

export const mockPriceLists = [
  { id: 'pl-1', tier: 'Gold', currency: 'USD', price_rule: 'Standard Base Price minus 10% Gold Discount' },
  { id: 'pl-2', tier: 'Silver', currency: 'USD', price_rule: 'Standard Base Price minus 5% Silver Discount' },
  { id: 'pl-3', tier: 'Bronze', currency: 'USD', price_rule: 'Standard List Price' }
];

export const mockDiscountTiers = [
  { id: 'dt-1', tier_name: 'Bronze', max_discount_pct: 5 },
  { id: 'dt-2', tier_name: 'Silver', max_discount_pct: 10 },
  { id: 'dt-3', tier_name: 'Gold', max_discount_pct: 15 }
];

export const mockCategoryDiscountCeilings = [
  { id: 'cdc-1', category_id: 'cat-1', category_name: 'Hardware', max_discount_pct: 10 },
  { id: 'cdc-2', category_id: 'cat-2', category_name: 'SaaS Subscriptions', max_discount_pct: 15 },
  { id: 'cdc-3', category_id: 'cat-3', category_name: 'Professional Services', max_discount_pct: 20 }
];

export const mockApprovalRules = [
  { id: 'ar-1', min_discount_pct: 0, max_discount_pct: 5, risk_level: 'low', steps: [] },
  { id: 'ar-2', min_discount_pct: 5.01, max_discount_pct: 15, risk_level: 'medium', steps: [{ step_order: 1, approver_role: 'sales_manager' }] },
  { id: 'ar-3', min_discount_pct: 15.01, max_discount_pct: 100, risk_level: 'high', steps: [{ step_order: 1, approver_role: 'sales_manager' }, { step_order: 2, approver_role: 'finance_ops' }] }
];

export const mockQuotations = [
  {
    id: 'q-1042',
    quote_number: 'Q-1042',
    customer_id: 'c-101',
    customer_name: 'Acme Corp',
    customer_tier: 'Gold',
    sales_rep_id: 'u-1',
    sales_rep_name: 'Alex Johnson',
    status: 'Pending Approval',
    blended_risk_score: 18.5,
    total_amount: 48500,
    created_at: '2026-09-02T10:30:00Z',
    lines: [
      {
        id: 'ql-1',
        product_id: 'prod-1',
        product_name: 'Enterprise Edge Server X-900',
        qty: 3,
        unit_price: 12500,
        discount_pct: 25,
        discount_limit_pct: 15, // snapshot limit!
        line_type: 'one_time',
        is_upsell: false
      },
      {
        id: 'ql-2',
        product_id: 'prod-2',
        product_name: 'DealFlow AI Cloud Suite',
        qty: 50,
        unit_price: 150,
        discount_pct: 12,
        discount_limit_pct: 15,
        line_type: 'recurring',
        is_upsell: true
      }
    ]
  },
  {
    id: 'q-1043',
    quote_number: 'Q-1043',
    customer_id: 'c-102',
    customer_name: 'Starlight Tech',
    customer_tier: 'Silver',
    sales_rep_id: 'u-1',
    sales_rep_name: 'Alex Johnson',
    status: 'Negotiation',
    blended_risk_score: 8.2,
    total_amount: 19200,
    created_at: '2026-09-03T14:15:00Z',
    lines: [
      {
        id: 'ql-3',
        product_id: 'prod-2',
        product_name: 'DealFlow AI Cloud Suite',
        qty: 100,
        unit_price: 150,
        discount_pct: 10,
        discount_limit_pct: 10,
        line_type: 'recurring',
        is_upsell: false
      }
    ]
  },
  {
    id: 'q-1044',
    quote_number: 'Q-1044',
    customer_id: 'c-103',
    customer_name: 'Nexus Logistics',
    customer_tier: 'Bronze',
    sales_rep_id: 'u-1',
    sales_rep_name: 'Alex Johnson',
    status: 'Approved',
    blended_risk_score: 3.5,
    total_amount: 14700,
    created_at: '2026-09-01T09:00:00Z',
    lines: [
      {
        id: 'ql-4',
        product_id: 'prod-4',
        product_name: 'Onsite Implementation & Engineering',
        qty: 7,
        unit_price: 2200,
        discount_pct: 4,
        discount_limit_pct: 5,
        line_type: 'one_time',
        is_upsell: false
      }
    ]
  },
  {
    id: 'q-1045',
    quote_number: 'Q-1045',
    customer_id: 'c-104',
    customer_name: 'Vanguard Health',
    customer_tier: 'Gold',
    sales_rep_id: 'u-1',
    sales_rep_name: 'Alex Johnson',
    status: 'Draft',
    blended_risk_score: 0,
    total_amount: 32000,
    created_at: '2026-09-05T08:00:00Z',
    lines: [
      {
        id: 'ql-5',
        product_id: 'prod-1',
        product_name: 'Enterprise Edge Server X-900',
        qty: 2,
        unit_price: 12500,
        discount_pct: 5,
        discount_limit_pct: 15,
        line_type: 'one_time',
        is_upsell: false
      }
    ]
  }
];

export const mockApprovals = [
  {
    id: 'app-1',
    quotation_id: 'q-1042',
    quote_number: 'Q-1042',
    customer_name: 'Acme Corp',
    customer_tier: 'Gold',
    risk_level: 'HIGH',
    blended_risk_score: 18.5,
    status: 'Pending',
    assigned_to_role: 'sales_manager',
    assigned_user: 'J. Rao',
    created_at: '2026-09-02T10:35:00Z',
    flagged_reasons: [
      { line_item: 'Enterprise Edge Server X-900', discount_given: 25, ceiling_limit: 15, over_by: 10 }
    ],
    logs: [
      { id: 'log-1', user: 'Alex Johnson (Sales Rep)', action: 'Submitted', date: '2026-09-02 10:35 AM', note: 'Submitted quote Q-1042 exceeding Gold tier limit' }
    ]
  }
];

export const mockWarehouses = [
  { id: 'wh-1', name: 'Main HQ Logistics Depot', shipping_weight: 1.0, location: 'Chicago, IL' },
  { id: 'wh-2', name: 'East Coast Distribution Center', shipping_weight: 1.5, location: 'Newark, NJ' },
  { id: 'wh-3', name: 'West Coast Hub', shipping_weight: 2.2, location: 'Reno, NV' }
];

export const mockStock = [
  { id: 'st-1', warehouse_id: 'wh-1', warehouse_name: 'Main HQ Logistics Depot', product_id: 'prod-1', product_name: 'Enterprise Edge Server X-900', qty_in_stock: 2, qty_reserved: 1, qty_available: 1 },
  { id: 'st-2', warehouse_id: 'wh-2', warehouse_name: 'East Coast Distribution Center', product_id: 'prod-1', product_name: 'Enterprise Edge Server X-900', qty_in_stock: 5, qty_reserved: 0, qty_available: 5 },
  { id: 'st-3', warehouse_id: 'wh-1', warehouse_name: 'Main HQ Logistics Depot', product_id: 'prod-4', product_name: 'Onsite Implementation', qty_in_stock: 50, qty_reserved: 5, qty_available: 45 }
];

export const mockFulfillmentOrders = [
  {
    id: 'fo-1',
    quotation_id: 'q-1042',
    quote_number: 'Q-1042',
    customer_name: 'Acme Corp',
    status: 'Split Pending - Main + East Depot',
    splits: [
      { id: 'sp-1', warehouse_name: 'Main HQ Logistics Depot', product_name: 'Enterprise Edge Server X-900', qty_fulfilled: 1, estimated_shipments: 1, cost: 120 },
      { id: 'sp-2', warehouse_name: 'East Coast Distribution Center', product_name: 'Enterprise Edge Server X-900', qty_fulfilled: 2, estimated_shipments: 1, cost: 240 }
    ],
    backorders: []
  }
];

export const mockSubscriptions = [
  {
    id: 'sub-101',
    customer_name: 'Acme Corp',
    plan_name: 'DealFlow AI Enterprise SaaS',
    cycle: 'monthly',
    next_bill_date: '2026-10-01',
    amount: 7500,
    status: 'Active',
    quotation_id: 'q-1042'
  },
  {
    id: 'sub-102',
    customer_name: 'Starlight Tech',
    plan_name: 'DealFlow AI Cloud Suite',
    cycle: 'yearly',
    next_bill_date: '2027-01-15',
    amount: 18000,
    status: 'Active',
    quotation_id: 'q-1043'
  }
];

export const mockInvoices = [
  {
    id: 'inv-1042',
    invoice_number: 'INV-1042',
    quote_number: 'Q-1042',
    customer_name: 'Acme Corp',
    amount: 48500,
    status: 'Unpaid',
    due_date: '2026-10-05',
    payment_stage: 'Invoiced',
    lines: [
      { id: 'il-1', description: 'Enterprise Edge Server X-900 (x3)', amount: 28125 },
      { id: 'il-2', description: 'DealFlow AI Cloud Suite (50 seats)', amount: 6600 },
      { id: 'il-3', description: 'Dedicated SLA & Onsite Setup', amount: 13775 }
    ],
    payments: []
  }
];

export const mockDealHealthAlerts = [
  {
    id: 'dha-1',
    quote_number: 'Q-1043',
    customer_name: 'Starlight Tech',
    alert_type: 'Stalled Deal',
    detail: 'Quotation has been in Negotiation stage for >7 days without customer response.',
    flagged_at: '2026-08-28T11:00:00Z',
    status: 'Open'
  },
  {
    id: 'dha-2',
    quote_number: 'Q-1042',
    customer_name: 'Acme Corp',
    alert_type: 'Discount Anomaly',
    detail: 'Discount on Hardware line exceeds Gold tier limit by 10%.',
    flagged_at: '2026-09-02T10:35:00Z',
    status: 'Open'
  }
];

export const mockAuditLogs = [
  { id: 'al-1', entity_type: 'quotation', entity_id: 'Q-1042', user: 'Alex Johnson', action: 'Created Quotation Draft', timestamp: '2026-09-02 10:30 AM' },
  { id: 'al-2', entity_type: 'quotation', entity_id: 'Q-1042', user: 'Alex Johnson', action: 'Submitted for Approval', timestamp: '2026-09-02 10:35 AM' },
  { id: 'al-3', entity_type: 'approval', entity_id: 'Q-1042', user: 'J. Rao', action: 'Reviewed Risk Score (HIGH)', timestamp: '2026-09-02 11:00 AM' }
];

export const mockUpsellRules = [
  {
    id: 'ur-1',
    base_product_id: 'prod-1',
    suggested_product_id: 'prod-3',
    suggested_product_name: '24/7 Dedicated Support & SLA Package',
    suggested_price: 3500,
    min_margin_pct: 65,
    is_promoted: true,
    margin_delta: 18
  },
  {
    id: 'ur-2',
    base_product_id: 'prod-1',
    suggested_product_id: 'prod-4',
    suggested_product_name: 'Onsite Implementation & Engineering',
    suggested_price: 2200,
    min_margin_pct: 50,
    is_promoted: false,
    margin_delta: 12
  }
];
