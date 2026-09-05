import React from 'react';
import MainNavbar from './components/layout/MainNavbar';
import LoginView from './views/LoginView';
import CustomerPortalNegotiationView from './views/CustomerPortalNegotiationView';
import AppRouter from './components/router/AppRouter';
import useNavigation from './hooks/useNavigation';
import useAppDataStore from './hooks/useAppDataStore';

export function App() {
  const navigation = useNavigation('login');
  const dataStore = useAppDataStore(navigation);

  const { currentView, navigateTo } = navigation;
  const {
    currentUser,
    setCurrentUser,
    activeQuote,
    handleLogout,
    handleLoginSuccess,
    onSubmitNegotiation,
    onConfirmQuote
  } = dataStore;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans transition-colors duration-200">
      {currentView === 'login' ? (
        <LoginView onLoginSuccess={handleLoginSuccess} />
      ) : currentView === 'portal' ? (
        <CustomerPortalNegotiationView
          quote={activeQuote}
          onLogout={handleLogout}
          onSubmitNegotiation={onSubmitNegotiation}
          onConfirmQuote={onConfirmQuote}
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
