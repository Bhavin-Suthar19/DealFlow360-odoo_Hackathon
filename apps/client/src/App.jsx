import React from 'react';
import MainNavbar from './components/layout/MainNavbar';
import LoginView from './views/LoginView';
import CustomerPortalNegotiationView from './views/CustomerPortalNegotiationView';
import AppRouter from './components/router/AppRouter';
import useNavigation from './hooks/useNavigation';
import useAppDataStore from './hooks/useAppDataStore';
import { Building2 } from 'lucide-react';

export function App() {
  const navigation = useNavigation('login');
  const dataStore = useAppDataStore(navigation);

  const { currentView, navigateTo } = navigation;
  const {
    sessionChecked,
    currentUser,
    setCurrentUser,
    activeQuote,
    handleLogout,
    handleLoginSuccess,
    onSubmitNegotiation,
    onConfirmQuote
  } = dataStore;

  // Show a branded loading screen while verifying stored session or loading initial data
  if (!sessionChecked || (currentUser && dataStore.isDataLoading && (!dataStore.quotations || dataStore.quotations.length === 0))) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#714B67] shadow-xl shadow-[#714B67]/20 animate-pulse">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <p className="text-sm font-semibold text-slate-500 animate-pulse">
          {!sessionChecked ? 'Restoring session…' : 'Loading DealFlow360 pipeline…'}
        </p>
      </div>
    );
  }

  // If no user is authenticated, always show login
  const showLogin = !currentUser || currentView === 'login';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-colors duration-200">
      {showLogin ? (
        <LoginView onLoginSuccess={handleLoginSuccess} />
      ) : currentView === 'portal' ? (
        <CustomerPortalNegotiationView
          quote={activeQuote}
          quotations={dataStore.quotations}
          onSelectQuote={dataStore.setSelectedQuoteId}
          products={dataStore.products}
          onLogout={handleLogout}
          onSubmitNegotiation={onSubmitNegotiation}
          onConfirmQuote={onConfirmQuote}
          onRefreshData={dataStore.refreshData}
        />
      ) : (
        <>
          <MainNavbar
            activeTab={currentView}
            setActiveTab={navigateTo}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            onLogout={handleLogout}
          />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
            <AppRouter navigation={navigation} dataStore={dataStore} />
          </main>
        </>
      )}
    </div>
  );
}

export default App;

