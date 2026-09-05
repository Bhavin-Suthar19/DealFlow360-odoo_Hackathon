import { useState, useEffect, useCallback } from 'react';
import { useModal } from '../context/ModalContext';
import { api, setAuthToken } from '../services/api';
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
} from '../data/mockData';

export const useAppDataStore = (navigation) => {
  const { showAlert, showConfirm } = useModal();
  const {
    selectedQuoteId,
    setSelectedQuoteId,
    selectedApprovalId,
    selectedFulfillmentId,
    selectedSubscriptionId,
    selectedInvoiceId,
    selectedProductId,
    setSelectedProductId,
    navigateTo,
    setCurrentView
  } = navigation;

  const [currentUser, setCurrentUser] = useState(mockUsers[0]);
  const [quotations, setQuotations] = useState(mockQuotations);
  const [approvals, setApprovals] = useState(mockApprovals);
  const [products, setProducts] = useState(mockProducts);
  const [fulfillmentOrders, setFulfillmentOrders] = useState(mockFulfillmentOrders);
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [invoices, setInvoices] = useState(mockInvoices);
  const [alerts, setAlerts] = useState(mockDealHealthAlerts);
  const [discountTiers, setDiscountTiers] = useState(mockDiscountTiers);
  const [categoryCeilings, setCategoryCeilings] = useState(mockCategoryDiscountCeilings);

  // Active targets
  const activeQuote = quotations.find((q) => q.id === selectedQuoteId) || quotations[0];
  const activeApproval = approvals.find((a) => a.id === selectedApprovalId) || approvals[0];
  const activeFulfillmentOrder = fulfillmentOrders.find((fo) => fo.id === selectedFulfillmentId) || fulfillmentOrders[0];
  const activeSubscription = subscriptions.find((s) => s.id === selectedSubscriptionId) || subscriptions[0];
  const activeInvoice = invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0];
  const activeProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Load backend data if accessible
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const [qRes, pRes, invRes] = await Promise.allSettled([
          api.quotations.getAll(),
          api.products ? api.products.getAll() : Promise.reject(),
          api.invoices ? api.invoices.getAll() : Promise.reject()
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

  const handleLogout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch (_) {}
    setAuthToken('');
    setCurrentUser(null);
    setCurrentView('login');
    window.history.pushState({ view: 'login' }, '', '/#login');
    showAlert({
      title: 'Logged Out Successfully',
      message: 'You have been signed out of DealFlow360.',
      variant: 'info'
    });
  }, [setCurrentView, showAlert]);

  const handleLoginSuccess = useCallback((user) => {
    setCurrentUser(user);
    if (user?.role === 'customer') {
      navigateTo('portal');
    } else {
      navigateTo('dashboard');
    }
  }, [navigateTo]);

  const handleCreateQuotation = useCallback(() => {
    const newQuote = {
      id: `q-${Date.now()}`,
      quote_number: `Q-${1040 + quotations.length + 1}`,
      customer_id: 'c-101',
      customer_name: 'Acme Corp',
      customer_tier: 'Gold',
      sales_rep_id: currentUser?.id || 'u-1',
      sales_rep_name: currentUser?.name || 'Alex Johnson',
      status: 'Draft',
      blended_risk_score: 0,
      total_amount: 0,
      created_at: new Date().toISOString(),
      lines: []
    };
    setQuotations((prev) => [newQuote, ...prev]);
    setSelectedQuoteId(newQuote.id);
    navigateTo('quotation-detail', newQuote.id);
  }, [quotations.length, currentUser, setSelectedQuoteId, navigateTo]);

  const handleSaveDraft = useCallback((updatedLines) => {
    setQuotations((prev) =>
      prev.map((q) => {
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
  }, [selectedQuoteId, showAlert]);

  const handleSubmitQuote = useCallback((updatedLines) => {
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
    const newStatus = isHighOrMed ? 'Pending Manager Approval' : 'Pending Customer Approval';

    showConfirm({
      title: isHighOrMed ? 'Submit for Manager Approval' : 'Publish Quotation to Customer',
      message: isHighOrMed
        ? `This quotation has a risk score of ${riskScore}% due to discount overages. Are you sure you want to submit it for governance approval?`
        : `This quotation total is $${total.toLocaleString()} and compliant with all category caps. Publish to Customer Review?`,
      confirmText: isHighOrMed ? 'Submit for Approval' : 'Publish to Customer',
      variant: isHighOrMed ? 'warning' : 'success',
      onConfirm: () => {
        setQuotations((prev) =>
          prev.map((q) => {
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
                user: `${currentUser?.name || 'User'} (${currentUser?.role || 'sales_rep'})`,
                action: 'Submitted',
                date: new Date().toLocaleTimeString(),
                note: `Submitted quote with risk score ${riskScore}%`
              }
            ]
          };
          setApprovals((prev) => [newApproval, ...prev]);
          navigateTo('approval-detail', newApproval.id);
        } else {
          navigateTo('quotations');
        }
      }
    });
  }, [selectedQuoteId, quotations, currentUser, showConfirm, setApprovals, navigateTo]);

  const handleApprove = useCallback((approvalId, note) => {
    const app = approvals.find((a) => a.id === approvalId);
    if (!app) return;

    const isHighRisk = (app.blended_risk_score || 0) > 15 || app.risk_level === 'HIGH';

    if (currentUser?.role === 'sales_manager' && isHighRisk) {
      showConfirm({
        title: 'Manager Approval — High Risk Escalation',
        message: `Quotation ${app.quote_number} has a Risk Score of ${app.blended_risk_score}% (>15% threshold). Approving will automatically escalate this deal to Financial Operations for final signoff. Proceed?`,
        confirmText: 'Approve & Escalate to Finance',
        variant: 'warning',
        onConfirm: async () => {
          setApprovals((prev) =>
            prev.map((a) => {
              if (a.id === approvalId) {
                return {
                  ...a,
                  status: 'Pending',
                  assigned_to_role: 'finance_ops',
                  assigned_user: 'M. Shah (Finance Ops)',
                  logs: [
                    ...a.logs,
                    {
                      id: `log-${Date.now()}`,
                      user: `${currentUser.name} (Sales Manager)`,
                      action: 'Approved & Escalated',
                      date: new Date().toLocaleTimeString(),
                      note: note || `Approved by Sales Manager. Auto-escalated to Financial Operations (Risk Score: ${app.blended_risk_score}% > 15%).`
                    }
                  ]
                };
              }
              return a;
            })
          );

          setQuotations((prev) =>
            prev.map((q) => (q.id === app.quotation_id ? { ...q, status: 'Pending Finance Approval' } : q))
          );

          showAlert({
            title: 'Escalated to Financial Operations',
            message: `Quotation ${app.quote_number} approved by Sales Manager and routed to Financial Operations for Level 2 signoff.`,
            variant: 'info'
          });

          navigateTo('approvals');
        }
      });
    } else {
      showConfirm({
        title: 'Approve & Confirm Quotation',
        message: `Are you sure you want to grant final approval for quotation ${app.quote_number}? This will confirm the deal and automatically trigger warehouse fulfillment.`,
        confirmText: 'Approve & Confirm',
        variant: 'success',
        onConfirm: async () => {
          setApprovals((prev) =>
            prev.map((a) => {
              if (a.id === approvalId) {
                return {
                  ...a,
                  status: 'Approved',
                  logs: [
                    ...a.logs,
                    {
                      id: `log-${Date.now()}`,
                      user: `${currentUser.name} (${currentUser.role})`,
                      action: 'Approved',
                      date: new Date().toLocaleTimeString(),
                      note: note || 'Final approval granted. Order confirmed.'
                    }
                  ]
                };
              }
              return a;
            })
          );

          setQuotations((prev) =>
            prev.map((q) => (q.id === app.quotation_id ? { ...q, status: 'Approved' } : q))
          );

          const newFulfillmentOrder = {
            id: `fo-${Date.now()}`,
            quotation_id: app.quotation_id,
            quote_number: app.quote_number,
            customer_name: app.customer_name,
            total_items: 5,
            status: 'Pending Split',
            suggested_split: [
              { warehouse_name: 'Main Austin Facility', qty: 3 },
              { warehouse_name: 'San Jose Logistics Hub', qty: 2 }
            ],
            splits: []
          };
          setFulfillmentOrders((prev) => [newFulfillmentOrder, ...prev]);

          showAlert({
            title: 'Quotation Approved & Confirmed',
            message: `Quotation ${app.quote_number} approved! Order created in Warehouse Fulfillment.`,
            variant: 'success'
          });

          navigateTo('approvals');
        }
      });
    }
  }, [approvals, currentUser, showConfirm, setQuotations, setApprovals, setFulfillmentOrders, showAlert, navigateTo]);

  const handleReturn = useCallback((approvalId, note) => {
    showConfirm({
      title: 'Return Quotation to Sales Rep',
      message: 'Return this quotation back to the Sales Rep for discount adjustment?',
      confirmText: 'Return to Rep',
      variant: 'warning',
      onConfirm: () => {
        const app = approvals.find((a) => a.id === approvalId);
        setApprovals((prev) =>
          prev.map((a) => {
            if (a.id === approvalId) {
              return {
                ...a,
                status: 'Returned',
                logs: [
                  ...a.logs,
                  {
                    id: `log-${Date.now()}`,
                    user: `${currentUser.name} (${currentUser.role})`,
                    action: 'Returned',
                    date: new Date().toLocaleTimeString(),
                    note: note || 'Returned for discount recalculation'
                  }
                ]
              };
            }
            return a;
          })
        );
        if (app) {
          setQuotations((prev) =>
            prev.map((q) => (q.id === app.quotation_id ? { ...q, status: 'Returned' } : q))
          );
        }
        showAlert({
          title: 'Quotation Returned',
          message: 'Quotation returned to Sales Rep for revision.',
          variant: 'info'
        });
        navigateTo('approvals');
      }
    });
  }, [approvals, currentUser, showConfirm, setApprovals, setQuotations, showAlert, navigateTo]);

  const handleReject = useCallback((approvalId, note) => {
    showConfirm({
      title: 'Reject Quotation',
      message: 'Reject this quotation governance request permanently?',
      confirmText: 'Reject Quote',
      variant: 'danger',
      onConfirm: () => {
        const app = approvals.find((a) => a.id === approvalId);
        setApprovals((prev) =>
          prev.map((a) => {
            if (a.id === approvalId) {
              return {
                ...a,
                status: 'Rejected',
                logs: [
                  ...a.logs,
                  {
                    id: `log-${Date.now()}`,
                    user: `${currentUser.name} (${currentUser.role})`,
                    action: 'Rejected',
                    date: new Date().toLocaleTimeString(),
                    note: note || 'Quotation rejected by governance'
                  }
                ]
              };
            }
            return a;
          })
        );
        if (app) {
          setQuotations((prev) =>
            prev.map((q) => (q.id === app.quotation_id ? { ...q, status: 'Rejected' } : q))
          );
        }
        showAlert({
          title: 'Quotation Rejected',
          message: 'Quotation has been rejected.',
          variant: 'danger'
        });
        navigateTo('approvals');
      }
    });
  }, [approvals, currentUser, showConfirm, setApprovals, setQuotations, showAlert, navigateTo]);

  const handleAcceptSplit = useCallback((orderId, splitData) => {
    setFulfillmentOrders((prev) =>
      prev.map((fo) => (fo.id === orderId ? { ...fo, status: 'Allocated', splits: splitData } : fo))
    );
    showAlert({
      title: 'Warehouse Split Confirmed',
      message: 'Stock allocated cleanly across target fulfillment hubs.',
      variant: 'success'
    });
    navigateTo('fulfillment');
  }, [setFulfillmentOrders, showAlert, navigateTo]);

  const handleCancelSubscription = useCallback((subId) => {
    showConfirm({
      title: 'Cancel Subscription',
      message: `Are you sure you want to cancel subscription ${subId}?`,
      confirmText: 'Cancel Subscription',
      variant: 'danger',
      onConfirm: () => {
        setSubscriptions((prev) =>
          prev.map((sub) => (sub.id === subId ? { ...sub, status: 'Canceled' } : sub))
        );
        showAlert({
          title: 'Subscription Canceled',
          message: `Subscription ${subId} marked as canceled.`,
          variant: 'info'
        });
      }
    });
  }, [showConfirm, setSubscriptions, showAlert]);

  const handleRecordPayment = useCallback((invId, amount) => {
    showConfirm({
      title: 'Confirm Payment Record',
      message: `Record payment of $${amount?.toLocaleString()} for invoice ${invId}?`,
      confirmText: 'Confirm Payment',
      variant: 'success',
      onConfirm: () => {
        setInvoices((prev) =>
          prev.map((inv) => (inv.id === invId ? { ...inv, status: 'Paid', payment_stage: 'Paid' } : inv))
        );
        showAlert({
          title: 'Payment Reconciled',
          message: `Payment of $${amount?.toLocaleString()} recorded successfully.`,
          variant: 'success'
        });
      }
    });
  }, [showConfirm, setInvoices, showAlert]);

  const handleNudgeAlert = useCallback((alertId) => {
    showAlert({
      title: 'Nudge Notification Sent',
      message: `Nudge alert notification sent to assigned deal team.`,
      variant: 'info'
    });
  }, [showAlert]);

  const handleEscalateAlert = useCallback((alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Escalated' } : a))
    );
    showAlert({
      title: 'Deal Health Escalated',
      message: 'Anomaly escalated to Revenue Operations leadership.',
      variant: 'warning'
    });
  }, [setAlerts, showAlert]);

  const handleSaveProduct = useCallback((updatedProduct) => {
    if (!updatedProduct.id) {
      const newProd = {
        ...updatedProduct,
        id: `prod-${Date.now()}`
      };
      setProducts((prev) => [newProd, ...prev]);
      setSelectedProductId(newProd.id);
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
    }
    showAlert({
      title: 'Product Saved',
      message: 'Product catalog entry and pricelist updated successfully.',
      variant: 'success'
    });
    navigateTo('products');
  }, [setProducts, setSelectedProductId, showAlert, navigateTo]);

  return {
    currentUser,
    setCurrentUser,
    quotations,
    setQuotations,
    approvals,
    setApprovals,
    products,
    setProducts,
    fulfillmentOrders,
    setFulfillmentOrders,
    subscriptions,
    setSubscriptions,
    invoices,
    setInvoices,
    alerts,
    setAlerts,
    discountTiers,
    setDiscountTiers,
    categoryCeilings,
    setCategoryCeilings,
    activeQuote,
    activeApproval,
    activeFulfillmentOrder,
    activeSubscription,
    activeInvoice,
    activeProduct,
    handleLogout,
    handleLoginSuccess,
    handleCreateQuotation,
    handleSaveDraft,
    handleSubmitQuote,
    handleApprove,
    handleReturn,
    handleReject,
    handleAcceptSplit,
    handleCancelSubscription,
    handleRecordPayment,
    handleNudgeAlert,
    handleEscalateAlert,
    handleSaveProduct
  };
};

export default useAppDataStore;
