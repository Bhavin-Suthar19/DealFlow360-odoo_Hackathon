import { useState, useEffect, useCallback } from 'react';

export const useNavigation = (initialView = 'login') => {
  const [currentView, setCurrentView] = useState(initialView);
  const [selectedQuoteId, setSelectedQuoteId] = useState('q-1042');
  const [selectedApprovalId, setSelectedApprovalId] = useState('app-1');
  const [selectedFulfillmentId, setSelectedFulfillmentId] = useState('fo-1');
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState('sub-101');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('inv-1042');
  const [selectedProductId, setSelectedProductId] = useState('prod-1');

  const navigateTo = useCallback((view, id = null, pushState = true) => {
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
      const targetPath = view === 'login' ? '/#login' : `/#${view}${id ? `/${id}` : ''}`;
      window.history.pushState({ view, id }, '', targetPath);
    }
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
        if (event.state.id) {
          const view = event.state.view;
          const id = event.state.id;
          if (view === 'quotation-detail') setSelectedQuoteId(id);
          if (view === 'approval-detail') setSelectedApprovalId(id);
          if (view === 'fulfillment-detail') setSelectedFulfillmentId(id);
          if (view === 'subscription-detail') setSelectedSubscriptionId(id);
          if (view === 'invoice-detail') setSelectedInvoiceId(id);
          if (view === 'product-config') setSelectedProductId(id);
        }
      } else {
        const rawHash = window.location.hash.replace('#', '');
        const [hView, hId] = rawHash.split('/');
        if (hView && hView !== 'login') {
          setCurrentView(hView);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    currentView,
    setCurrentView,
    selectedQuoteId,
    setSelectedQuoteId,
    selectedApprovalId,
    setSelectedApprovalId,
    selectedFulfillmentId,
    setSelectedFulfillmentId,
    selectedSubscriptionId,
    setSelectedSubscriptionId,
    selectedInvoiceId,
    setSelectedInvoiceId,
    selectedProductId,
    setSelectedProductId,
    navigateTo
  };
};

export default useNavigation;
