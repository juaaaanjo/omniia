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
import PlanDetail from './pages/PlanDetail';
import Reports from './pages/Reports';
import OAuthCallback from './pages/OAuthCallback';
import NotFound from './pages/NotFound';

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
      <Sidebar />
      <main className="p-6 pl-32">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
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
                      <Route
                        path={ROUTES.PLAN_DETAIL}
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <PlanDetail />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path={ROUTES.REPORTS}
                        element={
                          <ProtectedRoute>
                            <Layout>
                              <Reports />
                            </Layout>
                          </ProtectedRoute>
                        }
                      />

                      {/* 404 route */}
                      <Route path="*" element={<NotFound />} />
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
