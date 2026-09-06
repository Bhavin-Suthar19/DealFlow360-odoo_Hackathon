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
import UserProfileView from '../../views/UserProfileView';
import { useModal } from '../../context/ModalContext';

export const AppRouter = ({ navigation, dataStore }) => {
  const { showAlert, showConfirm } = useModal();
  const {
    currentView,
    navigateTo,
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
    setSelectedProductId
  } = navigation;
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
    upsellRules,
    activeQuote,
    activeApproval,
    linkedApprovalQuote,
    activeFulfillmentOrder,
    activeSubscription,
    activeInvoice,
    activeProduct,
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
    handleGenerateInvoice,
    handleNudgeAlert,
    handleEscalateAlert,
    handleRecalculateAlerts,
    handleSaveProduct,
    handleAddVariant,
    handleDeleteVariant,
    handleSaveDiscountConfig,
    customers,
    updateProfile,
    handleUpdateProfile
  } = dataStore;

  switch (currentView) {
    case 'dashboard':
      return (
        <DashboardView
          quotations={quotations}
          approvals={approvals}
          alerts={alerts}
          auditLogs={dataStore.auditLogs || []}
          currentUser={currentUser}
          onRefresh={dataStore.refreshData}
          onNavigate={(view, id) => {
            if (view === 'quotation-builder') {
              if (currentUser?.role && currentUser.role !== 'sales_rep') {
                showAlert({
                  title: 'Access Restricted',
                  message: 'New quotations can only be created by Sales Representatives.',
                  variant: 'warning'
                });
                return;
              }
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
          currentUser={currentUser}
          onSelectQuote={(id) => navigateTo('quotation-detail', id)}
          onCreateQuote={currentUser?.role === 'sales_rep' ? handleCreateQuotation : undefined}
        />
      );

    case 'quotation-detail':
      return (
        <QuotationBuilderView
          quote={activeQuote}
          products={products}
          customers={customers}
          upsellRules={upsellRules || []}
          invoices={invoices}
          onSelectInvoice={(id) => navigateTo('invoice-detail', id)}
          onGenerateInvoice={handleGenerateInvoice}
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
          onEscalateToManager={handleEscalateToManager}
        />
      );

    case 'approvals':
      return (
        <ApprovalsListView
          approvals={approvals}
          quotations={quotations}
          onSelectApproval={(id) => navigateTo('approval-detail', id)}
        />
      );

    case 'approval-detail':
      return (
        <ApprovalAuditDetailView
          approval={activeApproval}
          quote={linkedApprovalQuote}
          currentUser={currentUser}
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
          quotations={quotations}
          onSelectInvoice={(id) => navigateTo('invoice-detail', id)}
          onGenerateInvoice={handleGenerateInvoice}
        />
      );

    case 'invoice-detail':
      return (
        <InvoiceDetailView
          invoice={activeInvoice}
          invoiceId={selectedInvoiceId}
          onBack={() => navigateTo('invoices')}
          onRecordPayment={handleRecordPayment}
          onSelectQuote={(id) => navigateTo('quotation-detail', id)}
        />
      );

    case 'deal-health':
      return (
        <DealHealthDashboardView
          alerts={alerts}
          quotations={quotations}
          onNudge={handleNudgeAlert}
          onEscalate={handleEscalateAlert}
          onRecalculate={handleRecalculateAlerts}
        />
      );

    case 'reports':
      return (
        <ReportingDashboardView
          quotations={quotations}
          approvals={approvals}
          invoices={invoices}
          products={products}
          subscriptions={subscriptions}
          currentUser={currentUser}
          onExport={async (format) => {
            try {
              showAlert({
                title: 'Report Download Initiated',
                message: `Exporting DealFlow360 Executive Report in .${format} format.`,
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
          categories={categories}
          variants={variants}
          priceLists={priceLists}
          onSelectProduct={(id) => navigateTo('product-config', id)}
          onCreateProduct={() => {
            setSelectedProductId(null);
            navigateTo('product-config');
          }}
          currentUser={currentUser}
        />
      );

    case 'product-config':
      return (
        <ProductPricelistConfigView
          product={activeProduct}
          categories={categories}
          variants={variants}
          onBack={() => navigateTo('products')}
          onSaveProduct={handleSaveProduct}
          onAddVariant={handleAddVariant}
          onDeleteVariant={handleDeleteVariant}
          currentUser={currentUser}
        />
      );

    case 'config':
      if (currentUser?.role && currentUser.role !== 'admin') {
        return (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs text-center max-w-lg mx-auto my-12 space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
            <p className="text-sm text-slate-600">
              Discount tier ceilings and governance matrices can only be configured by System Administrators.
            </p>
            <button
              onClick={() => navigateTo('dashboard')}
              className="px-4 py-2 bg-[#714B67] hover:bg-[#5b3c53] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        );
      }
      return (
        <DiscountTiersSetupView
          currentUser={currentUser}
          discountTiers={discountTiers}
          categoryCeilings={categoryCeilings}
          approvalRules={[]}
          onSaveConfig={handleSaveDiscountConfig}
        />
      );

    case 'profile':
      return <UserProfileView currentUser={currentUser} onUpdateProfile={updateProfile || handleUpdateProfile} />;

    default:
      return null;
  }
};

export default AppRouter;
