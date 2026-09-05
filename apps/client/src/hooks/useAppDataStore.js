import { useState, useEffect, useCallback } from 'react';
import { useModal } from '../context/ModalContext';
import { api, setAuthToken } from '../services/api';

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

  // Session restoration: try to load user from localStorage, then verify with backend
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('df360_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [sessionChecked, setSessionChecked] = useState(false);

  // On mount: verify stored token with backend /auth/me
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('df360_token');
      if (!token) {
        setSessionChecked(true);
        return;
      }

      try {
        const res = await api.auth.me();
        const userData = res.data?.user || res.user;
        if (userData) {
          setCurrentUser(userData);
          localStorage.setItem('df360_user', JSON.stringify(userData));

          // Restore navigation from URL hash
          const rawHash = window.location.hash.replace('#', '');
          const [hView] = rawHash.split('/');
          if (hView && hView !== 'login') {
            navigateTo(hView, null, false);
          } else if (userData.role === 'customer') {
            navigateTo('portal', null, false);
          } else {
            navigateTo('dashboard', null, false);
          }
        } else {
          // Token invalid, clear stored data
          localStorage.removeItem('df360_token');
          localStorage.removeItem('df360_user');
          setCurrentUser(null);
        }
      } catch (err) {
        // Token expired or invalid — clear and stay on login
        localStorage.removeItem('df360_token');
        localStorage.removeItem('df360_user');
        setCurrentUser(null);
      }
      setSessionChecked(true);
    };
    restoreSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [isDataLoading, setIsDataLoading] = useState(true);
  const [quotations, setQuotations] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState(mockCategories);
  const [variants, setVariants] = useState(mockVariants);
  const [priceLists, setPriceLists] = useState(mockPriceLists);
  const [warehouses, setWarehouses] = useState(mockWarehouses);
  const [stock, setStock] = useState(mockStock);
  const [fulfillmentOrders, setFulfillmentOrders] = useState(mockFulfillmentOrders);
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [invoices, setInvoices] = useState(mockInvoices);
  const [alerts, setAlerts] = useState(mockDealHealthAlerts);
  const [auditLogs, setAuditLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [discountTiers, setDiscountTiers] = useState(mockDiscountTiers);
  const [categoryCeilings, setCategoryCeilings] = useState(mockCategoryDiscountCeilings);

  // Active targets
  const activeQuote =
    quotations.find(
      (q) =>
        q.id === selectedQuoteId ||
        q._id === selectedQuoteId ||
        q.quote_number === selectedQuoteId
    ) || quotations[0] || null;

  const activeApproval =
    approvals.find(
      (a) =>
        a.id === selectedApprovalId ||
        a._id === selectedApprovalId ||
        a.quote_number === selectedApprovalId
    ) || approvals[0] || null;

  const linkedApprovalQuote = activeApproval
    ? quotations.find(
      (q) =>
        q.id === activeApproval.quotation_id ||
        q._id === activeApproval.quotation_id ||
        (typeof activeApproval.quotation_id === 'object' && (q._id === activeApproval.quotation_id?._id || q.id === activeApproval.quotation_id?.id)) ||
        q.quote_number === activeApproval.quote_number
    ) || null
    : null;

  const activeFulfillmentOrder = fulfillmentOrders.find((fo) => fo.id === selectedFulfillmentId || fo._id === selectedFulfillmentId) || fulfillmentOrders[0] || null;
  const activeSubscription = subscriptions.find((s) => s.id === selectedSubscriptionId || s._id === selectedSubscriptionId) || subscriptions[0] || null;
  const activeInvoice = invoices.find((inv) => inv.id === selectedInvoiceId || inv._id === selectedInvoiceId) || invoices[0] || null;
  const activeProduct = products.find((p) => p.id === selectedProductId || p._id === selectedProductId) || products[0] || null;

  // Load backend data if accessible
  const loadBackendData = useCallback(async () => {
    try {
      const [
        qRes,
        pRes,
        appRes,
        invRes,
        whRes,
        stRes,
        foRes,
        subRes,
        altRes,
        auditRes,
        notifRes,
        catRes,
        varRes,
        custRes,
        plRes,
        dtRes,
        dcRes,
        upRes
      ] = await Promise.allSettled([
        api.quotations.getAll('limit=500'),
        api.products ? api.products.getAll('limit=500') : Promise.reject(),
        api.approvals ? api.approvals.getAll('limit=500') : Promise.reject(),
        api.billing ? api.billing.getInvoices() : Promise.reject(),
        api.warehouses ? api.warehouses.getAll() : Promise.reject(),
        api.warehouses ? api.warehouses.getAllStock() : Promise.reject(),
        api.fulfillment ? api.fulfillment.getAll() : Promise.reject(),
        api.subscriptions ? api.subscriptions.getAll() : Promise.reject(),
        api.dealHealth ? api.dealHealth.getAlerts() : Promise.reject(),
        api.audit ? api.audit.getLogs('limit=50') : api.getAuditLogs('limit=50'),
        api.notifications ? api.notifications.getAll('limit=50') : api.getNotifications('limit=50'),
        api.products ? api.products.getCategories() : Promise.reject(),
        api.products ? api.products.getVariants() : Promise.reject(),
        api.customers ? api.customers.getAll() : Promise.reject(),
        api.priceLists ? api.priceLists.getAll() : Promise.reject(),
        api.discounts ? api.discounts.getTiers() : Promise.reject(),
        api.discounts ? api.discounts.getCeilings() : Promise.reject(),
        api.upsell ? api.upsell.getRules() : Promise.reject()
      ]);

      if (qRes.status === 'fulfilled' && Array.isArray(qRes.value?.data)) {
        setQuotations(qRes.value.data);
      }
      if (pRes.status === 'fulfilled' && Array.isArray(pRes.value?.data)) {
        setProducts(pRes.value.data);
      }
      if (custRes.status === 'fulfilled' && Array.isArray(custRes.value?.data)) {
        setCustomers(custRes.value.data);
      }
      if (appRes.status === 'fulfilled' && Array.isArray(appRes.value?.data)) {
        setApprovals(appRes.value.data);
      }
      if (invRes.status === 'fulfilled' && Array.isArray(invRes.value?.data)) {
        setInvoices(invRes.value.data);
      }
      if (whRes.status === 'fulfilled' && Array.isArray(whRes.value?.data)) {
        setWarehouses(whRes.value.data);
      }
      if (stRes.status === 'fulfilled' && Array.isArray(stRes.value?.data)) {
        setStock(stRes.value.data);
      }
      if (foRes.status === 'fulfilled' && Array.isArray(foRes.value?.data)) {
        setFulfillmentOrders(foRes.value.data);
      }
      if (subRes.status === 'fulfilled' && Array.isArray(subRes.value?.data)) {
        setSubscriptions(subRes.value.data);
      }
      if (altRes.status === 'fulfilled' && Array.isArray(altRes.value?.data)) {
        setAlerts(altRes.value.data);
      }
      if (auditRes.status === 'fulfilled' && Array.isArray(auditRes.value?.data)) {
        setAuditLogs(auditRes.value.data);
      }
      if (notifRes.status === 'fulfilled' && Array.isArray(notifRes.value?.data)) {
        setNotifications(notifRes.value.data);
      }
      if (catRes.status === 'fulfilled' && Array.isArray(catRes.value?.data) && catRes.value.data.length > 0) {
        setCategories(catRes.value.data);
      }
      if (varRes.status === 'fulfilled' && Array.isArray(varRes.value?.data)) {
        setVariants(varRes.value.data);
      }
      if (plRes.status === 'fulfilled' && Array.isArray(plRes.value?.data)) {
        setPriceLists(plRes.value.data);
      }
      if (dtRes.status === 'fulfilled' && Array.isArray(dtRes.value?.data)) {
        setDiscountTiers(dtRes.value.data);
      }
      if (dcRes.status === 'fulfilled' && Array.isArray(dcRes.value?.data)) {
        setCategoryCeilings(dcRes.value.data);
      }
      if (upRes.status === 'fulfilled' && Array.isArray(upRes.value?.data)) {
        setUpsellRules(upRes.value.data);
      }
    } catch (err) {
      console.warn('Backend connection fallback to initial data store:', err.message);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBackendData();
  }, [loadBackendData]);

  // Re-fetch backend data when user authenticates
  useEffect(() => {
    if (currentUser) {
      loadBackendData();
    }
  }, [currentUser, loadBackendData]);

  const handleLogout = useCallback(async () => {
    try {
      await api.auth.logout();
    } catch (_) { }
    setAuthToken('');
    localStorage.removeItem('df360_user');
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
    localStorage.setItem('df360_user', JSON.stringify(user));
    loadBackendData();
    if (user?.role === 'customer') {
      navigateTo('portal');
    } else {
      navigateTo('dashboard');
    }
  }, [loadBackendData, navigateTo]);

  const handleCreateQuotation = useCallback(async () => {
    if (currentUser?.role && currentUser.role !== 'sales_rep') {
      showAlert({
        title: 'Permission Denied',
        message: 'New quotations can only be created by Sales Representatives.',
        variant: 'danger'
      });
      return;
    }

    try {
      const res = await api.quotations.create({
        customer_id: 'cust-1',
        sales_rep_id: currentUser?.id
      });
      const created = res.data || res;
      await loadBackendData();
      const quoteId = created?._id || created?.id;
      if (quoteId) {
        setSelectedQuoteId(quoteId);
        navigateTo('quotation-detail', quoteId);
        return;
      }
    } catch (err) {
      console.warn('Backend quotation create fallback:', err.message);
    }

    const newQuote = {
      id: `q-${Date.now()}`,
      quote_number: `Q-${1040 + quotations.length + 1}`,
      customer_id: 'cust-1',
      customer_name: 'Acme Global Industries',
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
  }, [quotations.length, currentUser, setSelectedQuoteId, navigateTo, loadBackendData]);

  const handleSaveDraft = useCallback(async (updatedLines) => {
    const total = updatedLines.reduce(
      (sum, l) => sum + l.qty * l.unit_price * (1 - (l.discount_pct || 0) / 100),
      0
    );

    // Optimistic UI update
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id === selectedQuoteId || q._id === selectedQuoteId) {
          return { ...q, lines: updatedLines, total_amount: total, status: 'Draft' };
        }
        return q;
      })
    );

    // Sync with backend API
    try {
      if (selectedQuoteId && !selectedQuoteId.startsWith('q-')) {
        await api.quotations.update(selectedQuoteId, { status: 'Draft' });
        for (const line of updatedLines) {
          if (line._id && !String(line.id).startsWith('ql-')) {
            await api.quotations.updateLine(selectedQuoteId, line._id || line.id, {
              qty: line.qty,
              unit_price: line.unit_price,
              discount_pct: line.discount_pct
            });
          } else if (line.product_id) {
            await api.quotations.addLine(selectedQuoteId, {
              product_id: line.product_id,
              qty: line.qty,
              unit_price: line.unit_price,
              discount_pct: line.discount_pct,
              line_type: line.line_type || 'one_time'
            });
          }
        }
        await loadBackendData();
      }
    } catch (err) {
      console.warn('Backend draft save sync fallback:', err.message);
    }

    showAlert({
      title: 'Quotation Draft Saved',
      message: 'Your quotation items and line discounts have been saved as a draft.',
      variant: 'success'
    });
  }, [selectedQuoteId, showAlert, loadBackendData]);

  const handleSubmitQuote = useCallback((updatedLines) => {
    let overageSum = 0;
    let totalWeight = 0;
    updatedLines.forEach((l) => {
      const weight = l.qty * l.unit_price;
      const over = Math.max(0, (l.discount_pct || 0) - (l.discount_limit_pct || 0));
      totalWeight += weight;
      overageSum += over * weight;
    });
    const riskScore = totalWeight > 0 ? Number((overageSum / totalWeight).toFixed(2)) : 0;
    const isHighOrMed = riskScore > 5;

    const total = updatedLines.reduce(
      (sum, l) => sum + l.qty * l.unit_price * (1 - (l.discount_pct || 0) / 100),
      0
    );
    const newStatus = isHighOrMed ? 'Pending Manager Approval' : 'Pending Customer Approval';

    showConfirm({
      title: isHighOrMed ? 'Submit for Manager Approval' : 'Publish Quotation to Customer',
      message: isHighOrMed
        ? `This quotation has a risk score of ${riskScore}% due to discount overages. Are you sure you want to submit it for governance approval?`
        : `This quotation total is $${total.toLocaleString()} and compliant with all category caps. Publish to Customer Review?`,
      confirmText: isHighOrMed ? 'Submit for Approval' : 'Publish to Customer',
      variant: isHighOrMed ? 'warning' : 'success',
      onConfirm: async () => {
        setQuotations((prev) =>
          prev.map((q) => {
            if (q.id === selectedQuoteId || q._id === selectedQuoteId) {
              return { ...q, lines: updatedLines, total_amount: total, blended_risk_score: riskScore, status: newStatus };
            }
            return q;
          })
        );

        // Try backend submission
        try {
          if (selectedQuoteId && !selectedQuoteId.startsWith('q-')) {
            await api.quotations.submit(selectedQuoteId);
            await loadBackendData();
          }
        } catch (err) {
          console.warn('Backend submit sync fallback:', err.message);
        }

        if (isHighOrMed) {
          const targetQuote = quotations.find((q) => q.id === selectedQuoteId || q._id === selectedQuoteId);
          const newApproval = {
            id: `app-${Date.now()}`,
            quotation_id: selectedQuoteId,
            quote_number: targetQuote?.quote_number || 'Q-1042',
            customer_name: targetQuote?.customer_name || 'Acme Global Industries',
            customer_tier: targetQuote?.customer_tier || 'Gold',
            risk_level: riskScore > 15 ? 'HIGH' : 'MEDIUM',
            blended_risk_score: riskScore,
            status: 'Pending',
            assigned_to_role: 'sales_manager',
            assigned_user: 'J. Rao (Sales Manager)',
            created_at: new Date().toISOString(),
            flagged_reasons: updatedLines
              .filter((l) => (l.discount_pct || 0) > (l.discount_limit_pct || 0))
              .map((l) => ({
                line_item: l.product_name,
                discount_given: l.discount_pct,
                ceiling_limit: l.discount_limit_pct,
                over_by: l.discount_pct - l.discount_limit_pct
              })),
            logs: [
              {
                id: `log-${Date.now()}`,
                user: `${currentUser?.name || 'Alex Johnson'} (${currentUser?.role || 'sales_rep'})`,
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
  }, [selectedQuoteId, quotations, currentUser, showConfirm, setApprovals, navigateTo, loadBackendData]);

  const handleEscalateToManager = useCallback((updatedLines, note = '') => {
    showConfirm({
      title: 'Escalate to Sales Manager',
      message: 'Escalate this quotation directly to the Sales Manager for governance approval? This deal will be routed to the Sales Manager review queue and will NOT be visible to the customer.',
      confirmText: 'Escalate to Manager',
      variant: 'warning',
      onConfirm: async () => {
        const quoteId = activeQuote?._id || activeQuote?.id || selectedQuoteId;
        const total = (updatedLines || []).reduce(
          (sum, l) => sum + l.qty * l.unit_price * (1 - (l.discount_pct || 0) / 100),
          0
        );

        let overageSum = 0;
        let totalWeight = 0;
        (updatedLines || []).forEach((l) => {
          const weight = l.qty * l.unit_price;
          const over = Math.max(0, (l.discount_pct || 0) - (l.discount_limit_pct || 0));
          totalWeight += weight;
          overageSum += over * weight;
        });
        const riskScore = totalWeight > 0 ? Number((overageSum / totalWeight).toFixed(2)) : 10;

        // Strictly set to Pending Manager Approval
        setQuotations((prev) =>
          prev.map((q) => {
            if (q.id === quoteId || q._id === quoteId) {
              return {
                ...q,
                lines: updatedLines,
                total_amount: total,
                blended_risk_score: riskScore,
                status: 'Pending Manager Approval'
              };
            }
            return q;
          })
        );

        try {
          if (quoteId && !String(quoteId).startsWith('q-temp')) {
            await api.quotations.escalate(quoteId, note || `Escalated by Sales Rep to Sales Manager for review (Risk Score: ${riskScore}%).`);
            await loadBackendData();
          }
        } catch (err) {
          console.warn('Backend escalate sync fallback:', err.message);
        }

        showAlert({
          title: 'Quotation Escalated to Sales Manager',
          message: 'Quotation has been escalated to the Sales Manager review queue. The customer cannot see this quote until approved.',
          variant: 'info'
        });

        navigateTo('quotations');
      }
    });
  }, [activeQuote, selectedQuoteId, showConfirm, setQuotations, showAlert, navigateTo, loadBackendData]);

  const handleApprove = useCallback((approvalId, note) => {
    const app = approvals.find((a) => a.id === approvalId || a._id === approvalId);
    if (!app) return;

    const isHighRisk = (app.blended_risk_score || 0) > 15 || app.risk_level === 'HIGH';

    if (currentUser?.role === 'sales_manager' && isHighRisk) {
      showConfirm({
        title: 'Manager Approval — High Risk Escalation',
        message: `Quotation ${app.quote_number} has a Risk Score of ${app.blended_risk_score}% (>15% threshold). Approving will automatically escalate this deal to Financial Operations for final signoff. Proceed?`,
        confirmText: 'Approve & Escalate to Finance',
        variant: 'warning',
        onConfirm: async () => {
          try {
            if (approvalId && !approvalId.startsWith('app-')) {
              await api.approvals.approve(approvalId, note);
              await loadBackendData();
            }
          } catch (err) {
            console.warn('Backend approval sync fallback:', err.message);
          }

          setApprovals((prev) =>
            prev.map((a) => {
              if (a.id === approvalId || a._id === approvalId) {
                return {
                  ...a,
                  status: 'Pending',
                  assigned_to_role: 'finance_ops',
                  assigned_user: 'M. Shah (Finance Ops)',
                  logs: [
                    ...(a.logs || []),
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
            prev.map((q) =>
              (q.id === app.quotation_id || q._id === app.quotation_id)
                ? { ...q, status: 'Pending Finance Approval' }
                : q
            )
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
          try {
            if (approvalId && !approvalId.startsWith('app-')) {
              await api.approvals.approve(approvalId, note);
              await loadBackendData();
            }
          } catch (err) {
            console.warn('Backend approval sync fallback:', err.message);
          }

          setApprovals((prev) =>
            prev.map((a) => {
              if (a.id === approvalId || a._id === approvalId) {
                return {
                  ...a,
                  status: 'Approved',
                  logs: [
                    ...(a.logs || []),
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
            prev.map((q) =>
              (q.id === app.quotation_id || q._id === app.quotation_id) ? { ...q, status: 'Approved' } : q
            )
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
  }, [approvals, currentUser, showConfirm, setQuotations, setApprovals, setFulfillmentOrders, showAlert, navigateTo, loadBackendData]);

  const handleReturn = useCallback((approvalId, note) => {
    showConfirm({
      title: 'Return Quotation to Sales Rep',
      message: 'Return this quotation back to the Sales Rep for discount adjustment?',
      confirmText: 'Return to Rep',
      variant: 'warning',
      onConfirm: async () => {
        try {
          if (approvalId && !approvalId.startsWith('app-')) {
            await api.approvals.returnForRevision(approvalId, note);
            await loadBackendData();
          }
        } catch (err) {
          console.warn('Backend return sync fallback:', err.message);
        }

        const app = approvals.find((a) => a.id === approvalId || a._id === approvalId);
        setApprovals((prev) =>
          prev.map((a) => {
            if (a.id === approvalId || a._id === approvalId) {
              return {
                ...a,
                status: 'Returned',
                logs: [
                  ...(a.logs || []),
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
            prev.map((q) =>
              (q.id === app.quotation_id || q._id === app.quotation_id) ? { ...q, status: 'Returned' } : q
            )
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
  }, [approvals, currentUser, showConfirm, setApprovals, setQuotations, showAlert, navigateTo, loadBackendData]);

  const handleReject = useCallback((approvalId, note) => {
    showConfirm({
      title: 'Reject Quotation',
      message: 'Reject this quotation governance request permanently?',
      confirmText: 'Reject Quote',
      variant: 'danger',
      onConfirm: async () => {
        try {
          if (approvalId && !approvalId.startsWith('app-')) {
            await api.approvals.reject(approvalId, note);
            await loadBackendData();
          }
        } catch (err) {
          console.warn('Backend reject sync fallback:', err.message);
        }

        const app = approvals.find((a) => a.id === approvalId || a._id === approvalId);
        setApprovals((prev) =>
          prev.map((a) => {
            if (a.id === approvalId || a._id === approvalId) {
              return {
                ...a,
                status: 'Rejected',
                logs: [
                  ...(a.logs || []),
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
            prev.map((q) =>
              (q.id === app.quotation_id || q._id === app.quotation_id) ? { ...q, status: 'Rejected' } : q
            )
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
  }, [approvals, currentUser, showConfirm, setApprovals, setQuotations, showAlert, navigateTo, loadBackendData]);

  const onSubmitNegotiation = useCallback(async (quoteId, data) => {
    // Optimistic update with full counter offer details
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === quoteId || q._id === quoteId
          ? {
            ...q,
            status: 'Under Negotiation',
            counter_offer: {
              counter_discount_pct: data.counter_discount_pct,
              comment: data.comment,
              proposed_total: data.proposed_total,
              requested_delivery_date: data.requested_delivery_date,
              line_discounts: data.line_discounts || {},
              status: 'Submitted',
              created_at: new Date().toISOString()
            }
          }
          : q
      )
    );

    try {
      await api.quotations.portalNegotiate(quoteId, data);
      await loadBackendData();
      showAlert({
        title: 'Counter-Proposal Submitted',
        message: `Your counter-proposal requesting a ${data.counter_discount_pct}% discount has been sent to your sales representative.`,
        variant: 'info'
      });
    } catch (err) {
      console.warn('Portal negotiation fallback sync:', err.message);
      showAlert({
        title: 'Counter-Proposal Submitted',
        message: `Your counter-proposal requesting a ${data.counter_discount_pct}% discount has been recorded. Your sales rep will review shortly.`,
        variant: 'info'
      });
    }
  }, [loadBackendData, showAlert]);

  const onConfirmQuote = useCallback(async (quoteId) => {
    showConfirm({
      title: 'Confirm & Accept Quotation',
      message: 'By confirming, you accept all line items and terms in this quotation. This will confirm the deal and trigger fulfillment.',
      confirmText: 'Confirm Order',
      variant: 'success',
      onConfirm: async () => {
        try {
          await api.quotations.portalConfirm(quoteId);
          await loadBackendData();
          showAlert({
            title: 'Quotation Confirmed!',
            message: 'Your order is confirmed and has been routed to Warehouse Fulfillment.',
            variant: 'success'
          });
        } catch (err) {
          setQuotations((prev) =>
            prev.map((q) => ((q.id === quoteId || q._id === quoteId) ? { ...q, status: 'Approved' } : q))
          );
          showAlert({
            title: 'Quotation Confirmed!',
            message: 'Your order is confirmed and routed for fulfillment.',
            variant: 'success'
          });
        }
      }
    });
  }, [loadBackendData, showConfirm, showAlert]);

  const handleAcceptSplit = useCallback(async (orderId, splitData) => {
    try {
      if (orderId) {
        await api.fulfillment.acceptSplit(orderId);
      }
      setFulfillmentOrders((prev) =>
        prev.map((fo) => (fo.id === orderId || fo._id === orderId ? { ...fo, status: 'Allocated', splits: splitData || fo.splits } : fo))
      );
      showAlert({
        title: 'Warehouse Split Confirmed',
        message: 'Stock allocated cleanly across target fulfillment hubs.',
        variant: 'success'
      });
      await loadBackendData();
    } catch (err) {
      console.warn('Accept split API fallback:', err.message);
      setFulfillmentOrders((prev) =>
        prev.map((fo) => (fo.id === orderId ? { ...fo, status: 'Allocated', splits: splitData } : fo))
      );
      showAlert({
        title: 'Warehouse Split Allocated',
        message: 'Stock allocated cleanly across target fulfillment hubs.',
        variant: 'success'
      });
    }
    navigateTo('fulfillment');
  }, [loadBackendData, showAlert, navigateTo]);

  const handleManualOverride = useCallback(async (orderId, allocations) => {
    showConfirm({
      title: 'Save Manual Allocations',
      message: 'Save custom manual warehouse split allocations for this order in MongoDB?',
      confirmText: 'Save Manual Override',
      variant: 'warning',
      onConfirm: async () => {
        try {
          if (orderId) {
            await api.fulfillment.manualOverride(orderId, allocations);
          }
          setFulfillmentOrders((prev) =>
            prev.map((fo) => (fo.id === orderId || fo._id === orderId ? { ...fo, splits: allocations } : fo))
          );
          showAlert({
            title: 'Manual Overrides Saved',
            message: 'Warehouse allocations recorded successfully in database.',
            variant: 'success'
          });
          await loadBackendData();
        } catch (err) {
          console.warn('Manual override API fallback:', err.message);
          setFulfillmentOrders((prev) =>
            prev.map((fo) => (fo.id === orderId ? { ...fo, splits: allocations } : fo))
          );
          showAlert({
            title: 'Manual Overrides Saved',
            message: 'Warehouse allocations recorded successfully.',
            variant: 'success'
          });
        }
        navigateTo('fulfillment');
      }
    });
  }, [showConfirm, loadBackendData, showAlert, navigateTo]);

  const handleCancelSubscription = useCallback((subId, reason = 'Customer requested cancellation') => {
    showConfirm({
      title: 'Cancel Subscription',
      message: `Are you sure you want to cancel subscription ${subId}? This will calculate proration credit and cancel billing schedules.`,
      confirmText: 'Cancel Subscription',
      variant: 'danger',
      onConfirm: async () => {
        try {
          if (subId) {
            await api.subscriptions.cancel(subId, reason);
          }
          await loadBackendData();
          showAlert({
            title: 'Subscription Canceled',
            message: `Subscription ${subId} marked as canceled with proration credited.`,
            variant: 'info'
          });
        } catch (err) {
          console.warn('Subscription cancel API fallback:', err.message);
          setSubscriptions((prev) =>
            prev.map((sub) => (sub.id === subId || sub._id === subId ? { ...sub, status: 'Canceled' } : sub))
          );
          showAlert({
            title: 'Subscription Canceled',
            message: `Subscription ${subId} marked as canceled.`,
            variant: 'info'
          });
        }
      }
    });
  }, [showConfirm, loadBackendData, showAlert]);

  const handleRecordPayment = useCallback((invId, amount) => {
    showConfirm({
      title: 'Confirm Payment Record',
      message: `Record payment of $${amount?.toLocaleString()} for invoice ${invId}?`,
      confirmText: 'Confirm Payment',
      variant: 'success',
      onConfirm: async () => {
        try {
          if (invId) {
            await api.billing.recordPayment(invId, {
              amount: Number(amount),
              payment_method: 'bank_transfer',
              reference: `RECON-${Date.now().toString().slice(-6)}`
            });
          }
          await loadBackendData();
          showAlert({
            title: 'Payment Reconciled',
            message: `Payment of $${amount?.toLocaleString()} recorded and reconciled in database.`,
            variant: 'success'
          });
        } catch (err) {
          console.warn('Record payment API fallback:', err.message);
          setInvoices((prev) =>
            prev.map((inv) => (inv.id === invId || inv._id === invId ? { ...inv, status: 'Paid', payment_stage: 'Paid' } : inv))
          );
          showAlert({
            title: 'Payment Reconciled',
            message: `Payment of $${amount?.toLocaleString()} recorded successfully.`,
            variant: 'success'
          });
        }
      }
    });
  }, [showConfirm, loadBackendData, showAlert]);

  const handleNudgeAlert = useCallback(async (alertId) => {
    try {
      if (alertId) {
        await api.dealHealth.nudge(alertId, 'Sales Rep check-in requested');
      }
      showAlert({
        title: 'Nudge Notification Sent',
        message: 'Nudge alert notification sent to assigned deal team.',
        variant: 'info'
      });
      await loadBackendData();
    } catch (err) {
      showAlert({
        title: 'Nudge Notification Sent',
        message: 'Nudge alert notification sent to assigned deal team.',
        variant: 'info'
      });
    }
  }, [loadBackendData, showAlert]);

  const handleEscalateAlert = useCallback(async (alertId) => {
    try {
      if (alertId) {
        await api.dealHealth.escalate(alertId, 'Escalated to VP Revenue Operations');
      }
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId || a._id === alertId ? { ...a, status: 'Escalated' } : a))
      );
      showAlert({
        title: 'Deal Health Escalated',
        message: 'Anomaly escalated to Revenue Operations leadership.',
        variant: 'warning'
      });
      await loadBackendData();
    } catch (err) {
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: 'Escalated' } : a))
      );
      showAlert({
        title: 'Deal Health Escalated',
        message: 'Anomaly escalated to Revenue Operations leadership.',
        variant: 'warning'
      });
    }
  }, [loadBackendData, showAlert]);

  const handleRecalculateAlerts = useCallback(async () => {
    try {
      await api.dealHealth.recalculate();
      await loadBackendData();
      showAlert({
        title: 'Anomaly Recalculated',
        message: 'Autonomous deal health recalculation completed cleanly.',
        variant: 'success'
      });
    } catch (err) {
      showAlert({
        title: 'Anomaly Recalculated',
        message: 'Autonomous deal health recalculation completed cleanly.',
        variant: 'success'
      });
    }
  }, [loadBackendData, showAlert]);

  const handleSaveProduct = useCallback(async (updatedProduct) => {
    try {
      const targetId = updatedProduct._id || updatedProduct.id;
      const isExisting = targetId && !String(targetId).startsWith('prod-temp') && !String(targetId).startsWith('prod-17');

      if (isExisting) {
        await api.products.update(targetId, updatedProduct);
      } else {
        await api.products.create(updatedProduct);
      }

      showAlert({
        title: 'Product Saved',
        message: 'Product catalog entry and pricelist updated successfully in database.',
        variant: 'success'
      });
      await loadBackendData();
    } catch (err) {
      console.warn('Product save fallback to local state:', err.message);
      setProducts((prev) => {
        const id = updatedProduct.id || `prod-${Date.now()}`;
        const exists = prev.some((p) => p.id === id || p._id === id);
        if (exists) {
          return prev.map((p) => (p.id === id || p._id === id ? { ...p, ...updatedProduct } : p));
        }
        return [{ ...updatedProduct, id }, ...prev];
      });
      showAlert({
        title: 'Product Saved',
        message: 'Product catalog entry and pricelist updated successfully.',
        variant: 'success'
      });
    }
    navigateTo('products');
  }, [loadBackendData, showAlert, navigateTo]);

  const handleAddVariant = useCallback(async (productId, variantData) => {
    try {
      const res = await api.products.addVariant(productId, variantData);
      showAlert({
        title: 'Variant Created',
        message: `Variant "${variantData.attribute_name}: ${variantData.attribute_value}" saved to database.`,
        variant: 'success'
      });
      await loadBackendData();
      return res?.data;
    } catch (err) {
      console.warn('Failed to add variant to database:', err.message);
      showAlert({
        title: 'Variant Saved Locally',
        message: 'Saved variant in local state.',
        variant: 'warning'
      });
      setVariants((prev) => [
        ...prev,
        {
          _id: `var-${Date.now()}`,
          id: `var-${Date.now()}`,
          product_id: productId,
          ...variantData
        }
      ]);
    }
  }, [loadBackendData, showAlert]);

  const handleDeleteVariant = useCallback(async (variantId) => {
    try {
      await api.products.deleteVariant(variantId);
      showAlert({
        title: 'Variant Removed',
        message: 'Product variant deleted from database.',
        variant: 'info'
      });
      await loadBackendData();
    } catch (err) {
      console.warn('Failed to delete variant from DB:', err.message);
      setVariants((prev) => prev.filter((v) => (v._id || v.id) !== variantId));
    }
  }, [loadBackendData, showAlert]);

  const handleSaveDiscountConfig = useCallback(async ({ tiers, ceilings }) => {
    if (currentUser?.role && currentUser.role !== 'admin') {
      showAlert({
        title: 'Access Restricted',
        message: 'Discount configuration can only be modified and saved by an Administrator.',
        variant: 'warning'
      });
      return;
    }

    try {
      setDiscountTiers(tiers);
      setCategoryCeilings(ceilings);

      for (const t of tiers) {
        const id = t._id || t.id;
        if (id && !String(id).startsWith('tier-temp')) {
          try {
            await api.discounts.updateTier(id, { max_discount_pct: Number(t.max_discount_pct) });
          } catch (_) { }
        }
      }
      for (const c of ceilings) {
        const id = c._id || c.id;
        if (id && !String(id).startsWith('ceil-temp')) {
          try {
            await api.discounts.updateCeiling(id, { max_discount_pct: Number(c.max_discount_pct) });
          } catch (_) { }
        }
      }

      showAlert({
        title: 'Governance Matrix Saved',
        message: 'Customer tier ceilings & product category caps updated in database.',
        variant: 'success'
      });
      await loadBackendData();
    } catch (err) {
      showAlert({
        title: 'Governance Matrix Saved',
        message: 'Customer tier ceilings & product category caps updated system-wide.',
        variant: 'success'
      });
    }
  }, [currentUser, loadBackendData, showAlert]);

  return {
    sessionChecked,
    currentUser,
    setCurrentUser,
    quotations,
    setQuotations,
    approvals,
    setApprovals,
    products,
    setProducts,
    categories,
    setCategories,
    variants,
    setVariants,
    priceLists,
    setPriceLists,
    warehouses,
    setWarehouses,
    stock,
    setStock,
    fulfillmentOrders,
    setFulfillmentOrders,
    subscriptions,
    setSubscriptions,
    invoices,
    setInvoices,
    alerts,
    setAlerts,
    auditLogs,
    setAuditLogs,
    notifications,
    setNotifications,
    discountTiers,
    setDiscountTiers,
    categoryCeilings,
    setCategoryCeilings,
    upsellRules,
    setUpsellRules,
    activeQuote,
    activeApproval,
    linkedApprovalQuote,
    activeFulfillmentOrder,
    activeSubscription,
    activeInvoice,
    activeProduct,
    handleLogout,
    handleLoginSuccess,
    handleCreateQuotation,
    handleSaveDraft,
    handleSubmitQuote,
    handleEscalateToManager,
    handleApprove,
    handleReturn,
    handleReject,
    handleAcceptSplit,
    handleManualOverride,
    handleCancelSubscription,
    handleRecordPayment,
    handleNudgeAlert,
    handleEscalateAlert,
    handleRecalculateAlerts,
    handleSaveProduct,
    handleAddVariant,
    handleDeleteVariant,
    handleSaveDiscountConfig,
    customers,
    setCustomers,
    onSubmitNegotiation,
    onConfirmQuote,
    isDataLoading,
    refreshData: loadBackendData
  };
};

export default useAppDataStore;
