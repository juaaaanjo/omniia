import { FiRefreshCw, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { useChat } from '../../hooks/useChat';
import { useLanguage } from '../../hooks/useLanguage';
import { useLocation } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/formatters';
import LanguageSwitcher from './LanguageSwitcher';
import { ROUTES } from '../../utils/constants';
import clsx from 'clsx';

const Header = () => {
  const { user, logout } = useAuth();
  const { syncStatus, syncAllData, lastUpdated, isLoading } = useData();
  const { openChat } = useChat();
  const { t } = useLanguage();
  const location = useLocation();

  const handleSync = async () => {
    try {
      await syncAllData();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const getSyncStatusColor = () => {
    if (!syncStatus) return 'bg-gray-400';
    if (syncStatus.status === 'syncing') return 'bg-yellow-400 animate-pulse';
    if (syncStatus.status === 'success') return 'bg-emerald-400';
    if (syncStatus.status === 'error') return 'bg-red-400';
    return 'bg-gray-400';
  };

  const getSyncStatusText = () => {
    if (!syncStatus) return t.dashboard.pageStatus.stable;
    if (syncStatus.status === 'syncing') return t.common.loading;
    if (syncStatus.status === 'success') return t.dashboard.pageStatus.stable;
    if (syncStatus.status === 'error') return t.dashboard.pageStatus.critical;
    return t.dashboard.pageStatus.stable;
  };

  // Get page title based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case ROUTES.DASHBOARD:
        return t.dashboard.title;
      case ROUTES.MARKETING:
        return t.marketing.title;
      case ROUTES.FINANCE:
        return t.finance.title;
      case ROUTES.ANALYTICS:
        return t.analytics.title;
      case ROUTES.FORECASTING:
        return t.forecasting.title;
      case ROUTES.PLANNING:
        return t.planning.title;
      case ROUTES.REPORTS:
        return t.reports.title;
      case ROUTES.INTEGRATIONS:
        return t.integrations.title;
      default:
        return t.dashboard.title;
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="flex items-center justify-between pl-32 pr-8 py-4">
        {/* Left section - Page title and status */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            {getPageTitle()}
          </h1>

          {/* Business Health Status Badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
            <div className={clsx('w-2 h-2 rounded-full', getSyncStatusColor())} />
            <span className="text-sm font-medium text-emerald-600">
              {getSyncStatusText()}
            </span>
          </div>

          {/* Chat Button */}
          <button
            onClick={openChat}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors text-sm font-medium"
          >
            Chat con Nerdee
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* Last updated with refresh */}
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                {formatRelativeTime(lastUpdated)}
              </span>
            )}
            <button
              onClick={handleSync}
              disabled={isLoading}
              className={clsx(
                'p-2 rounded-lg hover:bg-gray-100 transition-colors',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
              title={t.dashboard.syncNow}
            >
              <FiRefreshCw
                className={clsx(
                  'w-5 h-5 text-gray-600',
                  isLoading && 'animate-spin'
                )}
              />
            </button>
          </div>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* User menu */}
          <div className="relative group">
            <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <FiUser className="w-5 h-5 text-white" />
              </div>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-4 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-b-2xl"
              >
                <FiLogOut className="w-4 h-4" />
                <span>{t.auth.logout}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
