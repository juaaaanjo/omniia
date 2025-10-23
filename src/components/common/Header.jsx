import { FiBell, FiRefreshCw, FiUser, FiLogOut, FiMessageCircle } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';
import { useChat } from '../../hooks/useChat';
import { useLanguage } from '../../hooks/useLanguage';
import { formatRelativeTime } from '../../utils/formatters';
import LanguageSwitcher from './LanguageSwitcher';
import clsx from 'clsx';

const Header = () => {
  const { user, logout } = useAuth();
  const { syncStatus, syncAllData, lastUpdated, isLoading } = useData();
  const { toggleChat, isChatOpen } = useChat();
  const { t } = useLanguage();

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
    if (syncStatus.status === 'success') return 'bg-green-400';
    if (syncStatus.status === 'error') return 'bg-red-400';
    return 'bg-gray-400';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary-600">
            Business Analytics
          </h1>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Last updated */}
          {lastUpdated && (
            <div className="hidden md:block text-sm text-gray-500">
              {t.dashboard.lastUpdated} {formatRelativeTime(lastUpdated)}
            </div>
          )}

          {/* Sync status */}
          <div className="flex items-center space-x-2">
            <div
              className={clsx(
                'w-2 h-2 rounded-full',
                getSyncStatusColor()
              )}
            />
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

          {/* Chat toggle */}
          <button
            onClick={toggleChat}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              isChatOpen
                ? 'bg-primary-100 text-primary-600'
                : 'hover:bg-gray-100 text-gray-600'
            )}
            title={t.chat.title}
          >
            <FiMessageCircle className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={t.settings.notifications}
          >
            <FiBell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User menu */}
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                <FiUser className="w-4 h-4 text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.name || user?.email}
              </span>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
