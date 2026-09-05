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
import MessagesView from './views/MessagesView';
import UserProfileView from './views/UserProfileView';
import { useModal } from './context/ModalContext';
import { useLogoutMutation } from './features/auth/authApi';
import { useDispatch } from 'react-redux';
import { clearAuth } from './features/auth/authSlice';
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
  const { showAlert, showConfirm } = useModal();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (e) {
      console.warn('Logout request failed', e);
    } finally {
      dispatch(clearAuth());
      setCurrentUser(null);
      setCurrentView('login');
    }
  };

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('df360_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('df360_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
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

  // Navigation Helper with full browser history (back/forward) support
  const navigateTo = (view, id = null, pushState = true) => {
    if (id) {
      if (view === 'quotation-detail') setSelectedQuoteId(id);
      if (view === 'approval-detail') setSelectedApprovalId(id);
      if (view === 'fulfillment-detail') setSelectedFulfillmentId(id);
      if (view === 'subscription-detail') setSelectedSubscriptionId(id);
      if (view === 'invoice-detail') setSelectedInvoiceId(id);
      if (view === 'product-config') setSelectedProductId(id);
    }
    setCurrentView(view);

    if (pushState) {
      const pathHash = `#${view}${id ? `/${id}` : ''}`;
      window.history.pushState({ view, id }, '', pathHash);
    }
  };

  // Browser Back/Forward PopState Event Listener
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        navigateTo(event.state.view, event.state.id, false);
      } else {
        const rawHash = window.location.hash.replace('#', '');
        const [hView, hId] = rawHash.split('/');
        if (hView) {
          navigateTo(hView, hId || null, false);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // Handlers & State Mutations
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    navigateTo('dashboard');
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
    navigateTo('quotation-detail', newQuote.id);
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
    showAlert({
      title: 'Quotation Draft Saved',
      message: 'Your quotation items and line discounts have been saved as a draft.',
      variant: 'success'
    });
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

    showConfirm({
      title: isHighOrMed ? 'Submit for Manager Approval' : 'Submit & Confirm Quotation',
      message: isHighOrMed
        ? `This quotation has a risk score of ${riskScore}% due to discount overages. Are you sure you want to submit it for governance approval?`
        : `This quotation total is $${total.toLocaleString()} and compliant with all category caps. Confirm submission?`,
      confirmText: isHighOrMed ? 'Submit for Approval' : 'Confirm & Submit',
      variant: isHighOrMed ? 'warning' : 'success',
      onConfirm: () => {
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
          navigateTo('approval-detail', newApproval.id);
        } else {
          navigateTo('quotations');
        }
      }
    });
  };

  const handleApprove = (approvalId, note) => {
    const app = approvals.find((a) => a.id === approvalId);
    showConfirm({
      title: 'Approve Quotation',
      message: `Are you sure you want to approve quotation ${app?.quote_number || approvalId} and advance it to fulfillment?`,
      confirmText: 'Approve Quotation',
      variant: 'success',
      onConfirm: () => {
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

        if (app) {
          setQuotations(
            quotations.map((q) => (q.id === app.quotation_id ? { ...q, status: 'Approved' } : q))
          );
        }
        navigateTo('approvals');
      }
    });
  };

  const handleReturn = (approvalId, note) => {
    const app = approvals.find((a) => a.id === approvalId);
    showConfirm({
      title: 'Return Quotation to Sales Rep',
      message: `Return quotation ${app?.quote_number || approvalId} back to the sales representative for revision?`,
      confirmText: 'Return for Revision',
      variant: 'warning',
      onConfirm: () => {
        setApprovals(
          approvals.map((a) => (a.id === approvalId ? { ...a, status: 'Returned' } : a))
        );
        if (app) {
          setQuotations(
            quotations.map((q) => (q.id === app.quotation_id ? { ...q, status: 'Draft' } : q))
          );
        }
        navigateTo('approvals');
      }
    });
  };

  const handleReject = (approvalId, note) => {
    const app = approvals.find((a) => a.id === approvalId);
    showConfirm({
      title: 'Reject Quotation',
      message: `Are you sure you want to reject quotation ${app?.quote_number || approvalId}? This action terminates governance processing.`,
      confirmText: 'Reject Quotation',
      variant: 'danger',
      onConfirm: () => {
        setApprovals(
          approvals.map((a) => (a.id === approvalId ? { ...a, status: 'Rejected' } : a))
        );
        if (app) {
          setQuotations(
            quotations.map((q) => (q.id === app.quotation_id ? { ...q, status: 'Rejected' } : q))
          );
        }
        navigateTo('approvals');
      }
    });
  };

  const handleAcceptSplit = (orderId) => {
    showConfirm({
      title: 'Accept Warehouse Split Allocation',
      message: 'Confirm suggested multi-warehouse fulfillment route and lock inventory allocations?',
      confirmText: 'Accept Split Route',
      variant: 'success',
      onConfirm: () => {
        setFulfillmentOrders(
          fulfillmentOrders.map((fo) => (fo.id === orderId ? { ...fo, status: 'Fulfilled' } : fo))
        );
        navigateTo('fulfillment');
      }
    });
  };

  const handleCancelSubscription = (subId, reason) => {
    showConfirm({
      title: 'Cancel Active Subscription',
      message: `Are you sure you want to cancel subscription ${subId}? An automatic mid-cycle proration credit note will be issued.`,
      confirmText: 'Cancel & Issue Credit Note',
      variant: 'danger',
      onConfirm: () => {
        setSubscriptions(
          subscriptions.map((s) => (s.id === subId ? { ...s, status: 'Cancelled' } : s))
        );
        showAlert({
          title: 'Subscription Cancelled',
          message: 'Mid-cycle proration calculated and Credit Note auto-generated.',
          variant: 'info'
        });
      }
    });
  };

  const handleRecordPayment = (invId, amount) => {
    showConfirm({
      title: 'Confirm Payment Record',
      message: `Record payment of $${amount?.toLocaleString()} for invoice ${invId}?`,
      confirmText: 'Confirm Payment',
      variant: 'success',
      onConfirm: () => {
        setInvoices(
          invoices.map((inv) => (inv.id === invId ? { ...inv, status: 'Paid', payment_stage: 'Paid' } : inv))
        );
        showAlert({
          title: 'Payment Reconciled',
          message: `Payment of $${amount?.toLocaleString()} recorded successfully.`,
          variant: 'success'
        });
      }
    });
  };

  const handleNudgeAlert = (alertId) => {
    setAlerts(
      alerts.map((al) => (al.id === alertId ? { ...al, status: 'Nudged' } : al))
    );
    showAlert({
      title: 'Sales Rep Nudged',
      message: 'One-click alert notification sent to account manager for stalled deal.',
      variant: 'success'
    });
  };

  const handleEscalateAlert = (alertId) => {
    showConfirm({
      title: 'Escalate Stalled Deal Anomaly',
      message: 'Escalate this stalled deal to executive leadership and VP of Sales?',
      confirmText: 'Escalate Deal',
      variant: 'warning',
      onConfirm: () => {
        setAlerts(
          alerts.map((al) => (al.id === alertId ? { ...al, status: 'Escalated' } : al))
        );
        showAlert({
          title: 'Deal Escalated',
          message: 'Notification escalated to VP of Sales & Executive Committee.',
          variant: 'warning'
        });
      }
    });
  };

  const handleSaveProduct = (prodData) => {
    const existing = products.find((p) => p.id === prodData.id);
    if (existing) {
      setProducts(products.map((p) => (p.id === prodData.id ? { ...p, ...prodData } : p)));
    } else {
      setProducts([...products, prodData]);
    }
    showAlert({
      title: 'Product Master Saved',
      message: `Product SKU ${prodData.name} saved successfully.`,
      variant: 'success'
    });
    navigateTo('products');
  };

  // Selected Data Finds
  const activeQuote = quotations.find((q) => q.id === selectedQuoteId) || quotations[0];
  const activeApproval = approvals.find((a) => a.id === selectedApprovalId) || approvals[0];
  const activeFulfillmentOrder = fulfillmentOrders.find((f) => f.id === selectedFulfillmentId) || fulfillmentOrders[0];
  const activeSubscription = subscriptions.find((s) => s.id === selectedSubscriptionId) || subscriptions[0];
  const activeInvoice = invoices.find((i) => i.id === selectedInvoiceId) || invoices[0];
  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-colors duration-200">
      {/* LOGIN VIEW */}
      {currentView === 'login' ? (
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onSelectPortal={() => navigateTo('portal')}
        />
      ) : currentView === 'portal' ? (
        /* CUSTOMER PORTAL VIEW */
        <CustomerPortalNegotiationView
          quote={activeQuote}
          onSwitchToInternal={() => navigateTo('dashboard')}
          onSubmitNegotiation={(id, data) => {
            showAlert({
              title: 'Proposal Submitted',
              message: 'Negotiation counter-offer and discount request submitted to sales management.',
              variant: 'success'
            });
          }}
          onConfirmQuote={(id) => {
            showConfirm({
              title: 'Accept Quotation Terms',
              message: 'Accept terms and convert quotation to a confirmed order?',
              confirmText: 'Accept & Confirm',
              variant: 'success',
              onConfirm: () => {
                setQuotations(quotations.map((q) => (q.id === id ? { ...q, status: 'Confirmed' } : q)));
                showAlert({
                  title: 'Quotation Confirmed',
                  message: 'Order confirmed! Order routing to warehouse fulfillment.',
                  variant: 'success'
                });
              }
            });
          }}
        />
      ) : (
        /* INTERNAL PLATFORM VIEWS */
        <>
          <MainNavbar
            activeTab={currentView}
            setActiveTab={navigateTo}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            onLogout={() => navigateTo('login')}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
            {currentView === 'dashboard' && (
              <DashboardView
                quotations={quotations}
                approvals={approvals}
                alerts={alerts}
                currentUser={currentUser}
                onNavigate={(view, id) => {
                  if (view === 'quotation-builder') {
                    handleCreateQuotation();
                  } else {
                    navigateTo(view, id);
                  }
                }}
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
                onBack={() => navigateTo('quotations')}
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
                onBack={() => navigateTo('approvals')}
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
                onBack={() => navigateTo('fulfillment')}
                onAcceptSplit={handleAcceptSplit}
                onManualOverride={(id, splits) => {
                  showConfirm({
                    title: 'Save Manual Allocations',
                    message: 'Save custom manual warehouse split allocations for this order?',
                    confirmText: 'Save Manual Override',
                    variant: 'warning',
                    onConfirm: () => {
                      setFulfillmentOrders(
                        fulfillmentOrders.map((fo) => (fo.id === id ? { ...fo, splits } : fo))
                      );
                      navigateTo('fulfillment');
                    }
                  });
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
                onBack={() => navigateTo('subscriptions')}
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
                onBack={() => navigateTo('invoices')}
                onRecordPayment={handleRecordPayment}
              />
            )}

            {currentView === 'deal-health' && (
              <DealHealthDashboardView
                alerts={alerts}
                onNudge={handleNudgeAlert}
                onEscalate={handleEscalateAlert}
                onRecalculate={() => {
                  showAlert({
                    title: 'Anomaly Recalculated',
                    message: 'Autonomous deal health recalculation completed cleanly.',
                    variant: 'success'
                  });
                }}
              />
            )}

            {currentView === 'reports' && (
              <ReportingDashboardView
                onExport={(format) => {
                  showAlert({
                    title: 'Report Download Initiated',
                    message: `Downloading DealFlow360 Executive Report in .${format} format.`,
                    variant: 'info'
                  });
                }}
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
                  navigateTo('product-config');
                }}
              />
            )}

            {currentView === 'product-config' && (
              <ProductPricelistConfigView
                product={activeProduct}
                categories={mockCategories}
                onBack={() => navigateTo('products')}
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
                  showAlert({
                    title: 'Governance Matrix Saved',
                    message: 'Customer tier ceilings & product category caps updated system-wide.',
                    variant: 'success'
                  });
                }}
              />
            )}

            {currentView === 'messages' && (
              <MessagesView currentUser={currentUser} />
            )}

            {currentView === 'profile' && (
              <UserProfileView currentUser={currentUser} />
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;
