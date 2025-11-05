import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { EioProvider } from './context/EioContext';
import { ChatProvider } from './context/ChatContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import ChatInterface from './components/chat/ChatInterface';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Marketing from './pages/Marketing';
import Finance from './pages/Finance';
import Analytics from './pages/Analytics';
import Integrations from './pages/Integrations';
import Forecasting from './pages/Forecasting';
import Planning from './pages/Planning';
import OAuthCallback from './pages/OAuthCallback';

import { ROUTES } from './utils/constants';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Layout wrapper for authenticated pages
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <ChatInterface />
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <Router>
              <DataProvider>
                <EioProvider>
                  <ChatProvider>
                    <Routes>
                      {/* Public routes */}
                      <Route path={ROUTES.LOGIN} element={<Login />} />
                      <Route path={ROUTES.REGISTER} element={<Register />} />
                      <Route path={ROUTES.OAUTH_CALLBACK} element={<OAuthCallback />} />

                      {/* Protected routes */}
                      <Route
                        path={ROUTES.DASHBOARD}
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Dashboard />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={ROUTES.MARKETING}
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Marketing />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={ROUTES.FINANCE}
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Finance />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={ROUTES.ANALYTICS}
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Analytics />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={ROUTES.INTEGRATIONS}
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Integrations />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={ROUTES.FORECASTING}
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Forecasting />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={ROUTES.PLANNING}
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Planning />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />

                      {/* 404 route */}
                      <Route
                        path="*"
                        element={
                          <div className="min-h-screen flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                              <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                              <p className="text-xl text-gray-600 mb-8">Page not found</p>
                              <a
                                href={ROUTES.DASHBOARD}
                                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                              >
                                Go to Dashboard
                              </a>
                            </div>
                          </div>
                        }
                      />
                    </Routes>
                  </ChatProvider>
                </EioProvider>
              </DataProvider>
            </Router>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
