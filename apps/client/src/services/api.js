/**
 * DealFlow360 Backend REST API Client
 */

const API_BASE = 'http://localhost:5001/api';

let authToken = localStorage.getItem('df360_token') || '';

export const setAuthToken = (token) => {
  authToken = token;
  if (token) localStorage.setItem('df360_token', token);
  else localStorage.removeItem('df360_token');
};

const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const contentType = res.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await res.json().catch(() => ({}));
    } else {
      const text = await res.text().catch(() => '');
      data = { message: text };
    }

    if (!res.ok) {
      throw new Error(data.error?.message || data.message || `API Request Failed (HTTP ${res.status})`);
    }
    return data;
  } catch (err) {
    // Try fallback to local relative /api endpoint
    try {
      const res = await fetch(`/api${endpoint}`, { ...options, headers });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json().catch(() => ({}));
        return data;
      }
    } catch (_) {}

    console.warn(`API call failed for ${endpoint}:`, err.message);
    throw err;
  }
};

export const api = {
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    signup: (userData) => request('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
    refresh: () => request('/auth/refresh', { method: 'POST' }),
    me: () => request('/auth/me'),
    portalLogin: (credentials) => request('/auth/portal/login', { method: 'POST', body: JSON.stringify(credentials) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    updateProfile: (data) => request('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) })
  },
  users: {
    provision: (userData) => request('/users/provision', { method: 'POST', body: JSON.stringify(userData) }),
    getAll: () => request('/users'),
    getProfile: () => request('/users/profile'),
    updateProfile: (data) => request('/users/profile', { method: 'PATCH', body: JSON.stringify(data) })
  },
  quotations: {
    getAll: (params = '') => request(`/quotations${params ? `?${params}` : ''}`),
    getById: (id) => request(`/quotations/${id}`),
    create: (data) => request('/quotations', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/quotations/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    createRFQ: (data) => request('/quotations/rfq', { method: 'POST', body: JSON.stringify(data) }),
    getRFQs: () => request('/quotations/rfq'),
    addLine: (id, lineData) => request(`/quotations/${id}/lines`, { method: 'POST', body: JSON.stringify(lineData) }),
    updateLine: (id, lineId, lineData) => request(`/quotations/${id}/lines/${lineId}`, { method: 'PATCH', body: JSON.stringify(lineData) }),
    deleteLine: (id, lineId) => request(`/quotations/${id}/lines/${lineId}`, { method: 'DELETE' }),
    sendToCustomer: (id) => request(`/quotations/${id}/send-to-customer`, { method: 'POST' }),
    escalate: (id, note) => request(`/quotations/${id}/escalate`, { method: 'POST', body: JSON.stringify({ note }) }),
    submit: (id) => request(`/quotations/${id}/submit`, { method: 'POST' }),
    portalNegotiate: (id, data) => request(`/negotiation/quotations/${id}/negotiate`, { method: 'POST', body: JSON.stringify(data) }),
    portalConfirm: (id) => request(`/negotiation/quotations/${id}/confirm`, { method: 'POST' })
  },
  approvals: {
    getAll: (params = '') => request(`/approvals${params ? `?${params}` : ''}`),
    getById: (id) => request(`/approvals/${id}`),
    approve: (id, note) => request(`/approvals/${id}/approve`, { method: 'POST', body: JSON.stringify({ note }) }),
    reject: (id, note) => request(`/approvals/${id}/reject`, { method: 'POST', body: JSON.stringify({ note }) }),
    returnForRevision: (id, note) => request(`/approvals/${id}/return-for-revision`, { method: 'POST', body: JSON.stringify({ note }) })
  },
  warehouses: {
    getAll: () => request('/warehouses'),
    getAllStock: () => request('/warehouses/all-stock'),
    getStock: (id) => request(`/warehouses/${id}/stock`),
    updateStock: (id, data) => request(`/warehouses/${id}/stock`, { method: 'PATCH', body: JSON.stringify(data) })
  },
  fulfillment: {
    getAll: () => request('/fulfillment'),
    getById: (id) => request(`/fulfillment/${id}`),
    acceptSplit: (id) => request(`/fulfillment/${id}/accept-suggested-split`, { method: 'POST' }),
    manualOverride: (id, allocations) => request(`/fulfillment/${id}/manual-override`, { method: 'POST', body: JSON.stringify({ allocations }) }),
    consolidateBackorder: (id) => request(`/fulfillment/${id}/consolidate-backorder`, { method: 'POST' })
  },
  subscriptions: {
    getAll: () => request('/subscriptions'),
    getPlans: () => request('/subscriptions/plans'),
    getBillingSchedule: (id) => request(`/subscriptions/${id}/billing-schedule`),
    cancel: (id, reason) => request(`/subscriptions/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) })
  },
  billing: {
    getInvoices: (query = '') => request(`/billing/invoices${query ? `?${query}` : ''}`),
    getInvoiceById: (id) => request(`/billing/invoices/${id}`),
    generateInvoice: (quotationId) => request('/billing/invoices/generate', { method: 'POST', body: JSON.stringify({ quotation_id: quotationId }) }),
    recordPayment: (id, paymentData) => request(`/billing/invoices/${id}/payments`, { method: 'POST', body: JSON.stringify(paymentData) })
  },
  products: {
    getAll: (params = '') => request(`/products${params ? `?${params}` : ''}`),
    getCategories: () => request('/products/categories'),
    getVariants: () => request('/products/variants'),
    getById: (id) => request(`/products/${id}`),
    create: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
    addVariant: (id, data) => request(`/products/${id}/variants`, { method: 'POST', body: JSON.stringify(data) }),
    updateVariant: (variantId, data) => request(`/products/variants/${variantId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteVariant: (variantId) => request(`/products/variants/${variantId}`, { method: 'DELETE' })
  },
  customers: {
    getAll: () => request('/customers'),
    getById: (id) => request(`/customers/${id}`)
  },
  priceLists: {
    getAll: () => request('/price-lists'),
    getById: (id) => request(`/price-lists/${id}`),
    create: (data) => request('/price-lists', { method: 'POST', body: JSON.stringify(data) })
  },
  discounts: {
    getTiers: () => request('/discount-tiers'),
    getCeilings: () => request('/discount-tiers/ceilings'),
    createTier: (data) => request('/discount-tiers', { method: 'POST', body: JSON.stringify(data) }),
    updateTier: (id, data) => request(`/discount-tiers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    createCeiling: (data) => request('/discount-tiers/ceilings', { method: 'POST', body: JSON.stringify(data) }),
    updateCeiling: (id, data) => request(`/discount-tiers/ceilings/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
  },
  dealHealth: {
    getAlerts: () => request('/deal-health/alerts'),
    escalate: (id, detail) => request(`/deal-health/alerts/${id}/escalate`, { method: 'POST', body: JSON.stringify({ detail }) }),
    nudge: (id, detail) => request(`/deal-health/alerts/${id}/nudge`, { method: 'POST', body: JSON.stringify({ detail }) }),
    recalculate: () => request('/deal-health/recalculate', { method: 'POST' })
  },
  upsell: {
    getRules: () => request('/upsell/rules'),
    getSuggestions: (productId) => request(`/upsell/suggestions/${productId}`),
    createRule: (data) => request('/upsell/rules', { method: 'POST', body: JSON.stringify(data) })
  },
  reports: {
    getSummary: (params = '') => request(`/reports/quotations${params ? `?${params}` : ''}`),
    export: (format = 'csv') => request(`/reports/export?format=${format}`)
  },
  audit: {
    getLogs: (params = '') => request(`/audit${params ? `?${params}` : ''}`),
    getAll: (params = '') => request(`/audit${params ? `?${params}` : ''}`)
  },
  notifications: {
    getAll: (params = '') => request(`/notifications${params ? `?${params}` : ''}`),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' })
  },

  // Direct convenience helpers
  getQuotations: (params = '') => request(`/quotations${params ? `?${params}` : ''}`),
  getApprovals: (params = '') => request(`/approvals${params ? `?${params}` : ''}`),
  getProducts: () => request('/products'),
  getInvoices: (params = '') => request(`/billing/invoices${params ? `?${params}` : ''}`),
  getAlerts: (params = '') => request(`/deal-health/alerts${params ? `?${params}` : ''}`),
  getAuditLogs: (params = '') => request(`/audit${params ? `?${params}` : ''}`),
  getNotifications: (params = '') => request(`/notifications${params ? `?${params}` : ''}`),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' })
};

export default api;
