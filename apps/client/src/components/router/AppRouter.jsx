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
    categories,
    variants,
    priceLists,
    warehouses,
    stock,
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
    handleManualOverride,
    handleCancelSubscription,
    handleRecordPayment,
    handleNudgeAlert,
    handleEscalateAlert,
    handleRecalculateAlerts,
    handleSaveProduct,
    handleSaveDiscountConfig
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
          onSendToCustomer={async (updatedLines) => {
            const quoteId = activeQuote?._id || activeQuote?.id;
            try {
              if (quoteId && !String(quoteId).startsWith('q-temp')) {
                await api.quotations.sendToCustomer(quoteId);
                await dataStore.refreshData();
              }
            } catch (err) {
              console.warn('Backend sendToCustomer sync fallback:', err.message);
            }

            setQuotations((prev) =>
              prev.map((q) =>
                (q.id === quoteId || q._id === quoteId)
                  ? { ...q, lines: updatedLines, status: 'Pending Customer Approval' }
                  : q
              )
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
          warehouses={warehouses}
          stock={stock}
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
          onManualOverride={(id, splits) => handleManualOverride(id, splits)}
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
          onRecalculate={handleRecalculateAlerts}
        />
      );

    case 'reports':
      return (
        <ReportingDashboardView
          quotations={quotations}
          onExport={async (format) => {
            try {
              showAlert({
                title: 'Report Download Initiated',
                message: `Downloading DealFlow360 Executive Report in .${format} format.`,
                variant: 'info'
              });
              await api.reports.export(format);
            } catch (_) {}
          }}
        />
      );

    case 'products':
      return (
        <ProductCatalogView
          products={products}
          variants={variants}
          priceLists={priceLists}
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
          categories={categories}
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
          onSaveConfig={handleSaveDiscountConfig}
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
