import React from 'react';
import DashboardView from '../../views/DashboardView';
import QuotationsKanbanView from '../../views/QuotationsKanbanView';
import QuotationBuilderView from '../../views/QuotationBuilderView';
import ApprovalsListView from '../../views/ApprovalsListView';
import ApprovalAuditDetailView from '../../views/ApprovalAuditDetailView';
import FulfillmentStockView from '../../views/FulfillmentStockView';
import FulfillmentSplitDetailView from '../../views/FulfillmentSplitDetailView';
import SubscriptionsListView from '../../views/SubscriptionsListView';
import BillingDetailView from '../../views/BillingDetailView';
import InvoicesListView from '../../views/InvoicesListView';
import InvoiceDetailView from '../../views/InvoiceDetailView';
import DealHealthDashboardView from '../../views/DealHealthDashboardView';
import ReportingDashboardView from '../../views/ReportingDashboardView';
import ProductCatalogView from '../../views/ProductCatalogView';
import ProductPricelistConfigView from '../../views/ProductPricelistConfigView';
import DiscountTiersSetupView from '../../views/DiscountTiersSetupView';
import MessagesView from '../../views/MessagesView';
import UserProfileView from '../../views/UserProfileView';
import {
  mockCategories,
  mockVariants,
  mockPriceLists,
  mockApprovalRules,
  mockWarehouses,
  mockStock,
  mockUpsellRules
} from '../../data/mockData';
import { useModal } from '../../context/ModalContext';

export const AppRouter = ({ navigation, dataStore }) => {
  const { showAlert, showConfirm } = useModal();
  const { currentView, navigateTo, setSelectedQuoteId, setSelectedApprovalId, setSelectedFulfillmentId, setSelectedSubscriptionId, setSelectedInvoiceId, setSelectedProductId } = navigation;
  const {
    currentUser,
    quotations,
    setQuotations,
    approvals,
    products,
    fulfillmentOrders,
    setFulfillmentOrders,
    subscriptions,
    invoices,
    alerts,
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
  } = dataStore;

  switch (currentView) {
    case 'dashboard':
      return (
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
      );

    case 'quotations':
      return (
        <QuotationsKanbanView
          quotations={quotations}
          onSelectQuote={(id) => navigateTo('quotation-detail', id)}
          onCreateQuote={handleCreateQuotation}
        />
      );

    case 'quotation-detail':
      return (
        <QuotationBuilderView
          quote={activeQuote}
          products={products}
          upsellRules={mockUpsellRules}
          onBack={() => navigateTo('quotations')}
          onSubmitQuote={handleSubmitQuote}
          onSaveDraft={handleSaveDraft}
          onSendToCustomer={(updatedLines) => {
            setQuotations((prev) =>
              prev.map((q) => (q.id === activeQuote?.id ? { ...q, lines: updatedLines, status: 'Pending Customer Approval' } : q))
            );
            showAlert({
              title: 'Quotation Published to Customer Review',
              message: 'Quotation published to Customer Portal under Customer Review status.',
              variant: 'success'
            });
            navigateTo('quotations');
          }}
          onEscalateToManager={(updatedLines) => {
            handleSubmitQuote(updatedLines);
          }}
        />
      );

    case 'approvals':
      return (
        <ApprovalsListView
          approvals={approvals}
          onSelectApproval={(id) => navigateTo('approval-detail', id)}
        />
      );

    case 'approval-detail':
      return (
        <ApprovalAuditDetailView
          approval={activeApproval}
          onBack={() => navigateTo('approvals')}
          onApprove={handleApprove}
          onReturn={handleReturn}
          onReject={handleReject}
        />
      );

    case 'fulfillment':
      return (
        <FulfillmentStockView
          warehouses={mockWarehouses}
          stock={mockStock}
          fulfillmentOrders={fulfillmentOrders}
          onSelectOrder={(id) => navigateTo('fulfillment-detail', id)}
        />
      );

    case 'fulfillment-detail':
      return (
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
                setFulfillmentOrders((prev) =>
                  prev.map((fo) => (fo.id === id ? { ...fo, splits } : fo))
                );
                navigateTo('fulfillment');
              }
            });
          }}
        />
      );

    case 'subscriptions':
      return (
        <SubscriptionsListView
          subscriptions={subscriptions}
          onSelectSubscription={(id) => navigateTo('subscription-detail', id)}
        />
      );

    case 'subscription-detail':
      return (
        <BillingDetailView
          subscription={activeSubscription}
          onBack={() => navigateTo('subscriptions')}
          onCancelSubscription={handleCancelSubscription}
        />
      );

    case 'invoices':
      return (
        <InvoicesListView
          invoices={invoices}
          onSelectInvoice={(id) => navigateTo('invoice-detail', id)}
        />
      );

    case 'invoice-detail':
      return (
        <InvoiceDetailView
          invoice={activeInvoice}
          onBack={() => navigateTo('invoices')}
          onRecordPayment={handleRecordPayment}
        />
      );

    case 'deal-health':
      return (
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
      );

    case 'reports':
      return (
        <ReportingDashboardView
          onExport={(format) => {
            showAlert({
              title: 'Report Download Initiated',
              message: `Downloading DealFlow360 Executive Report in .${format} format.`,
              variant: 'info'
            });
          }}
        />
      );

    case 'products':
      return (
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
      );

    case 'product-config':
      return (
        <ProductPricelistConfigView
          product={activeProduct}
          categories={mockCategories}
          onBack={() => navigateTo('products')}
          onSaveProduct={handleSaveProduct}
        />
      );

    case 'config':
      return (
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
      );

    case 'messages':
      return <MessagesView currentUser={currentUser} />;

    case 'profile':
      return <UserProfileView currentUser={currentUser} />;

    default:
      return null;
  }
};

export default AppRouter;
