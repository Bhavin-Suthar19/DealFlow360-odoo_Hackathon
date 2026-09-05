import React, { useState, useEffect } from 'react';
import MainNavbar from './components/layout/MainNavbar';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import QuotationsKanbanView from './views/QuotationsKanbanView';
import QuotationBuilderView from './views/QuotationBuilderView';
import ApprovalsListView from './views/ApprovalsListView';
import ApprovalAuditDetailView from './views/ApprovalAuditDetailView';
import FulfillmentStockView from './views/FulfillmentStockView';
import FulfillmentSplitDetailView from './views/FulfillmentSplitDetailView';
import SubscriptionsListView from './views/SubscriptionsListView';
import BillingDetailView from './views/BillingDetailView';
import CustomerPortalNegotiationView from './views/CustomerPortalNegotiationView';
import InvoicesListView from './views/InvoicesListView';
import InvoiceDetailView from './views/InvoiceDetailView';
import DealHealthDashboardView from './views/DealHealthDashboardView';
import ReportingDashboardView from './views/ReportingDashboardView';
import ProductCatalogView from './views/ProductCatalogView';
import ProductPricelistConfigView from './views/ProductPricelistConfigView';
import DiscountTiersSetupView from './views/DiscountTiersSetupView';
import api from './services/api';

import {
  mockUsers,
  mockCategories,
  mockProducts,
  mockVariants,
  mockPriceLists,
  mockDiscountTiers,
  mockCategoryDiscountCeilings,
  mockApprovalRules,
  mockQuotations,
  mockApprovals,
  mockWarehouses,
  mockStock,
  mockFulfillmentOrders,
  mockSubscriptions,
  mockInvoices,
  mockDealHealthAlerts,
  mockUpsellRules
} from './data/mockData';

export function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('df360_theme') || 'light';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('df360_theme', nextTheme);
  };

  const [currentView, setCurrentView] = useState('login'); // 'login' | 'portal' | 'dashboard' | ...
  const [currentUser, setCurrentUser] = useState(mockUsers[0]);

  // Data Store States
  const [quotations, setQuotations] = useState(mockQuotations);
  const [approvals, setApprovals] = useState(mockApprovals);
  const [products, setProducts] = useState(mockProducts);
  const [fulfillmentOrders, setFulfillmentOrders] = useState(mockFulfillmentOrders);
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [invoices, setInvoices] = useState(mockInvoices);
  const [alerts, setAlerts] = useState(mockDealHealthAlerts);
  const [discountTiers, setDiscountTiers] = useState(mockDiscountTiers);
  const [categoryCeilings, setCategoryCeilings] = useState(mockCategoryDiscountCeilings);

  // Selection Detail Targets
  const [selectedQuoteId, setSelectedQuoteId] = useState('q-1042');
  const [selectedApprovalId, setSelectedApprovalId] = useState('app-1');
  const [selectedFulfillmentId, setSelectedFulfillmentId] = useState('fo-1');
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState('sub-101');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('inv-1042');
  const [selectedProductId, setSelectedProductId] = useState('prod-1');

  // Load backend data if accessible
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const [qRes, pRes, invRes] = await Promise.allSettled([
          api.getQuotations(),
          api.getProducts(),
          api.getInvoices()
        ]);
        if (qRes.status === 'fulfilled' && qRes.value?.data?.length) setQuotations(qRes.value.data);
        if (pRes.status === 'fulfilled' && pRes.value?.data?.length) setProducts(pRes.value.data);
        if (invRes.status === 'fulfilled' && invRes.value?.data?.length) setInvoices(invRes.value.data);
      } catch (err) {
        console.warn('Backend connection fallback to initial data store');
      }
    };
    loadBackendData();
  }, []);

  // Navigation Helper
  const navigateTo = (view, id = null) => {
    if (id) {
      if (view === 'quotation-detail') setSelectedQuoteId(id);
      if (view === 'approval-detail') setSelectedApprovalId(id);
      if (view === 'fulfillment-detail') setSelectedFulfillmentId(id);
      if (view === 'subscription-detail') setSelectedSubscriptionId(id);
      if (view === 'invoice-detail') setSelectedInvoiceId(id);
      if (view === 'product-config') setSelectedProductId(id);
    }
    setCurrentView(view);
  };

  // Handlers & State Mutations
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleCreateQuotation = () => {
    const newQuote = {
      id: `q-${Date.now()}`,
      quote_number: `Q-${1040 + quotations.length + 1}`,
      customer_id: 'c-101',
      customer_name: 'Acme Corp',
      customer_tier: 'Gold',
      sales_rep_id: currentUser.id,
      sales_rep_name: currentUser.name,
      status: 'Draft',
      blended_risk_score: 0,
      total_amount: 0,
      created_at: new Date().toISOString(),
      lines: []
    };
    setQuotations([newQuote, ...quotations]);
    setSelectedQuoteId(newQuote.id);
    setCurrentView('quotation-detail');
  };

  const handleSaveDraft = (updatedLines) => {
    setQuotations(
      quotations.map((q) => {
        if (q.id === selectedQuoteId) {
          const total = updatedLines.reduce((sum, l) => sum + l.qty * l.unit_price * (1 - l.discount_pct / 100), 0);
          return { ...q, lines: updatedLines, total_amount: total, status: 'Draft' };
        }
        return q;
      })
    );
  };

  const handleSubmitQuote = (updatedLines) => {
    let overageSum = 0;
    let totalWeight = 0;
    updatedLines.forEach((l) => {
      const weight = l.qty * l.unit_price;
      const over = Math.max(0, l.discount_pct - l.discount_limit_pct);
      totalWeight += weight;
      overageSum += over * weight;
    });
    const riskScore = totalWeight > 0 ? Number((overageSum / totalWeight).toFixed(2)) : 0;
    const isHighOrMed = riskScore > 5;

    const total = updatedLines.reduce((sum, l) => sum + l.qty * l.unit_price * (1 - l.discount_pct / 100), 0);
    const newStatus = isHighOrMed ? 'Pending Approval' : 'Approved';

    setQuotations(
      quotations.map((q) => {
        if (q.id === selectedQuoteId) {
          return { ...q, lines: updatedLines, total_amount: total, blended_risk_score: riskScore, status: newStatus };
        }
        return q;
      })
    );

    if (isHighOrMed) {
      const newApproval = {
        id: `app-${Date.now()}`,
        quotation_id: selectedQuoteId,
        quote_number: quotations.find((q) => q.id === selectedQuoteId)?.quote_number || 'Q-1042',
        customer_name: 'Acme Corp',
        customer_tier: 'Gold',
        risk_level: riskScore > 15 ? 'HIGH' : 'MEDIUM',
        blended_risk_score: riskScore,
        status: 'Pending',
        assigned_to_role: 'sales_manager',
        assigned_user: 'J. Rao',
        created_at: new Date().toISOString(),
        flagged_reasons: updatedLines
          .filter((l) => l.discount_pct > l.discount_limit_pct)
          .map((l) => ({
            line_item: l.product_name,
            discount_given: l.discount_pct,
            ceiling_limit: l.discount_limit_pct,
            over_by: l.discount_pct - l.discount_limit_pct
          })),
        logs: [
          {
            id: `log-${Date.now()}`,
            user: `${currentUser.name} (${currentUser.role})`,
            action: 'Submitted',
            date: new Date().toLocaleTimeString(),
            note: `Submitted quote with risk score ${riskScore}%`
          }
        ]
      };
      setApprovals([newApproval, ...approvals]);
      setSelectedApprovalId(newApproval.id);
      setCurrentView('approval-detail');
    } else {
      setCurrentView('quotations');
    }
  };

  const handleApprove = (approvalId, note) => {
    setApprovals(
      approvals.map((a) => {
        if (a.id === approvalId) {
          return {
            ...a,
            status: 'Approved',
            logs: [...a.logs, { id: `log-${Date.now()}`, user: currentUser.name, action: 'Approved', date: new Date().toLocaleTimeString(), note }]
          };
        }
        return a;
      })
    );

    const app = approvals.find((a) => a.id === approvalId);
    if (app) {
      setQuotations(
        quotations.map((q) => (q.id === app.quotation_id ? { ...q, status: 'Approved' } : q))
      );
    }
    setCurrentView('approvals');
  };

  const handleReturn = (approvalId, note) => {
    setApprovals(
      approvals.map((a) => (a.id === approvalId ? { ...a, status: 'Returned' } : a))
    );
    const app = approvals.find((a) => a.id === approvalId);
    if (app) {
      setQuotations(
        quotations.map((q) => (q.id === app.quotation_id ? { ...q, status: 'Draft' } : q))
      );
    }
    setCurrentView('approvals');
  };

  const handleReject = (approvalId, note) => {
    setApprovals(
      approvals.map((a) => (a.id === approvalId ? { ...a, status: 'Rejected' } : a))
    );
    const app = approvals.find((a) => a.id === approvalId);
    if (app) {
      setQuotations(
        quotations.map((q) => (q.id === app.quotation_id ? { ...q, status: 'Rejected' } : q))
      );
    }
    setCurrentView('approvals');
  };

  const handleAcceptSplit = (orderId) => {
    setFulfillmentOrders(
      fulfillmentOrders.map((fo) => (fo.id === orderId ? { ...fo, status: 'Fulfilled' } : fo))
    );
    setCurrentView('fulfillment');
  };

  const handleCancelSubscription = (subId, reason) => {
    setSubscriptions(
      subscriptions.map((s) => (s.id === subId ? { ...s, status: 'Cancelled' } : s))
    );
  };

  const handleRecordPayment = (invId, amount) => {
    setInvoices(
      invoices.map((inv) => (inv.id === invId ? { ...inv, status: 'Paid', payment_stage: 'Paid' } : inv))
    );
  };

  const handleNudgeAlert = (alertId) => {
    setAlerts(
      alerts.map((al) => (al.id === alertId ? { ...al, status: 'Nudged' } : al))
    );
  };

  const handleEscalateAlert = (alertId) => {
    setAlerts(
      alerts.map((al) => (al.id === alertId ? { ...al, status: 'Escalated' } : al))
    );
  };

  const handleSaveProduct = (prodData) => {
    const existing = products.find((p) => p.id === prodData.id);
    if (existing) {
      setProducts(products.map((p) => (p.id === prodData.id ? { ...p, ...prodData } : p)));
    } else {
      setProducts([...products, prodData]);
    }
    setCurrentView('products');
  };

  // Selected Data Finds
  const activeQuote = quotations.find((q) => q.id === selectedQuoteId) || quotations[0];
  const activeApproval = approvals.find((a) => a.id === selectedApprovalId) || approvals[0];
  const activeFulfillmentOrder = fulfillmentOrders.find((f) => f.id === selectedFulfillmentId) || fulfillmentOrders[0];
  const activeSubscription = subscriptions.find((s) => s.id === selectedSubscriptionId) || subscriptions[0];
  const activeInvoice = invoices.find((i) => i.id === selectedInvoiceId) || invoices[0];
  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
        {/* LOGIN VIEW */}
        {currentView === 'login' ? (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onSelectPortal={() => setCurrentView('portal')}
          />
        ) : currentView === 'portal' ? (
          /* CUSTOMER PORTAL VIEW */
          <CustomerPortalNegotiationView
            quote={activeQuote}
            onSwitchToInternal={() => setCurrentView('dashboard')}
            onSubmitNegotiation={(id, data) => alert('Negotiation request submitted to sales manager!')}
            onConfirmQuote={(id) => {
              setQuotations(quotations.map((q) => (q.id === id ? { ...q, status: 'Confirmed' } : q)));
              alert('Quotation confirmed! Order routing to fulfillment.');
            }}
          />
        ) : (
          /* INTERNAL PLATFORM VIEWS */
          <>
            <MainNavbar
              activeTab={currentView}
              setActiveTab={setCurrentView}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              onLogout={() => setCurrentView('login')}
              theme={theme}
              onToggleTheme={toggleTheme}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
              {currentView === 'dashboard' && (
                <DashboardView
                  quotations={quotations}
                  approvals={approvals}
                  alerts={alerts}
                  onNavigate={navigateTo}
                />
              )}

              {currentView === 'quotations' && (
                <QuotationsKanbanView
                  quotations={quotations}
                  onSelectQuote={(id) => navigateTo('quotation-detail', id)}
                  onCreateQuote={handleCreateQuotation}
                />
              )}

              {currentView === 'quotation-detail' && (
                <QuotationBuilderView
                  quote={activeQuote}
                  products={products}
                  upsellRules={mockUpsellRules}
                  onBack={() => setCurrentView('quotations')}
                  onSubmitQuote={handleSubmitQuote}
                  onSaveDraft={handleSaveDraft}
                />
              )}

              {currentView === 'approvals' && (
                <ApprovalsListView
                  approvals={approvals}
                  onSelectApproval={(id) => navigateTo('approval-detail', id)}
                />
              )}

              {currentView === 'approval-detail' && (
                <ApprovalAuditDetailView
                  approval={activeApproval}
                  onBack={() => setCurrentView('approvals')}
                  onApprove={handleApprove}
                  onReturn={handleReturn}
                  onReject={handleReject}
                />
              )}

              {currentView === 'fulfillment' && (
                <FulfillmentStockView
                  warehouses={mockWarehouses}
                  stock={mockStock}
                  fulfillmentOrders={fulfillmentOrders}
                  onSelectOrder={(id) => navigateTo('fulfillment-detail', id)}
                />
              )}

              {currentView === 'fulfillment-detail' && (
                <FulfillmentSplitDetailView
                  order={activeFulfillmentOrder}
                  onBack={() => setCurrentView('fulfillment')}
                  onAcceptSplit={handleAcceptSplit}
                  onManualOverride={(id, splits) => {
                    setFulfillmentOrders(
                      fulfillmentOrders.map((fo) => (fo.id === id ? { ...fo, splits } : fo))
                    );
                    setCurrentView('fulfillment');
                  }}
                />
              )}

              {currentView === 'subscriptions' && (
                <SubscriptionsListView
                  subscriptions={subscriptions}
                  onSelectSubscription={(id) => navigateTo('subscription-detail', id)}
                />
              )}

              {currentView === 'subscription-detail' && (
                <BillingDetailView
                  subscription={activeSubscription}
                  onBack={() => setCurrentView('subscriptions')}
                  onCancelSubscription={handleCancelSubscription}
                />
              )}

              {currentView === 'invoices' && (
                <InvoicesListView
                  invoices={invoices}
                  onSelectInvoice={(id) => navigateTo('invoice-detail', id)}
                />
              )}

              {currentView === 'invoice-detail' && (
                <InvoiceDetailView
                  invoice={activeInvoice}
                  onBack={() => setCurrentView('invoices')}
                  onRecordPayment={handleRecordPayment}
                />
              )}

              {currentView === 'deal-health' && (
                <DealHealthDashboardView
                  alerts={alerts}
                  onNudge={handleNudgeAlert}
                  onEscalate={handleEscalateAlert}
                  onRecalculate={() => alert('Anomaly detection recalculation executed cleanly!')}
                />
              )}

              {currentView === 'reports' && (
                <ReportingDashboardView
                  onExport={(format) => alert(`Downloading DealFlow360 Executive Report in .${format} format`)}
                />
              )}

              {currentView === 'products' && (
                <ProductCatalogView
                  products={products}
                  variants={mockVariants}
                  priceLists={mockPriceLists}
                  onSelectProduct={(id) => navigateTo('product-config', id)}
                  onCreateProduct={() => {
                    setSelectedProductId(null);
                    setCurrentView('product-config');
                  }}
                />
              )}

              {currentView === 'product-config' && (
                <ProductPricelistConfigView
                  product={activeProduct}
                  categories={mockCategories}
                  onBack={() => setCurrentView('products')}
                  onSaveProduct={handleSaveProduct}
                />
              )}

              {currentView === 'config' && (
                <DiscountTiersSetupView
                  discountTiers={discountTiers}
                  categoryCeilings={categoryCeilings}
                  approvalRules={mockApprovalRules}
                  onSaveConfig={({ tiers, ceilings }) => {
                    setDiscountTiers(tiers);
                    setCategoryCeilings(ceilings);
                  }}
                />
              )}
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
