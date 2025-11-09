import { useState } from 'react';
import { FiCheck, FiX, FiRefreshCw, FiSettings } from 'react-icons/fi';
import Badge from '../common/Badge';
import { useLanguage } from '../../hooks/useLanguage';

const IntegrationCard = ({
  name,
  description,
  icon: Icon,
  connected = false,
  lastSync = null,
  status = 'disconnected',
  onConnect,
  onDisconnect,
  onSync,
  onSettings,
  loading = false,
}) => {
  const { t } = useLanguage();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    if (onSync && connected) {
      setSyncing(true);
      try {
        await onSync();
      } finally {
        setSyncing(false);
      }
    }
  };

  const formatLastSync = (timestamp) => {
    if (!timestamp) return t.integrations.neverSynced;
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getStatusBadge = () => {
    if (connected) {
      return (
        <Badge color="green" size="sm">
          <FiCheck className="w-3 h-3 mr-1" />
          {t.integrations.connected}
        </Badge>
      );
    }
    return (
      <Badge color="gray" size="sm">
        <FiX className="w-3 h-3 mr-1" />
        {t.integrations.disconnected}
      </Badge>
    );
  };

  return (
    <div className="card card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white">
            {Icon && <Icon className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900">{name}</h3>
            {getStatusBadge()}
          </div>
        </div>
        {onSettings && connected && (
          <button
            onClick={onSettings}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Settings"
          >
            <FiSettings className="w-5 h-5" />
          </button>
        )}
      </div>

      <p className="text-sm font-normal text-gray-600 mb-4">{description}</p>

      {connected && lastSync && (
        <div className="mb-4 text-sm font-normal text-gray-500">
          <span className="font-medium">{t.integrations.lastSync}:</span>{' '}
          {formatLastSync(lastSync)}
        </div>
      )}

      <div className="flex gap-2">
        {!connected ? (
          <button
            onClick={onConnect}
            disabled={loading}
            className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t.common.loading : t.integrations.connect}
          </button>
        ) : (
          <>
            <button
              onClick={handleSync}
              disabled={syncing || loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiRefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? t.integrations.syncing : t.integrations.sync}
            </button>
            <button
              onClick={onDisconnect}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.integrations.disconnect}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default IntegrationCard;
