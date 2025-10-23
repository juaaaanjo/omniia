import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import IntegrationCard from '../components/integrations/IntegrationCard';
import MetaAdsManualTokenModal from '../components/integrations/MetaAdsManualTokenModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiTrendingUp, FiActivity } from 'react-icons/fi';
import dataService from '../services/dataService';

const Integrations = () => {
  const { t } = useLanguage();
  const [syncStatus, setSyncStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [showMetaAdsModal, setShowMetaAdsModal] = useState(false);
  const [metaAdsModalError, setMetaAdsModalError] = useState(null);

  const getTransactionsSyncRange = useCallback(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setFullYear(start.getFullYear() - 2);
    start.setHours(0, 0, 0, 0);
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, []);

  const getMetaAdsSyncRange = useCallback(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date();
    start.setDate(start.getDate() - 90);
    start.setHours(0, 0, 0, 0);
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  }, []);

  const loadSyncStatus = useCallback(async () => {
    try {
      setLoading(true);
      const status = await dataService.getSyncStatus();
      setSyncStatus(status);
      setActionError(null);
    } catch (err) {
      setError(err.message || 'Failed to load integration status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSyncStatus();
  }, [loadSyncStatus]);

  const setIntegrationLoading = useCallback((integrationId, isLoading) => {
    setActionLoading((prev) => ({
      ...prev,
      [integrationId]: isLoading,
    }));
  }, []);

  const handleSync = useCallback(async (integrationType, startDate, endDate) => {
    try {
      setActionError(null);
      if (integrationType === 'transactions') {
        const defaultRange = getTransactionsSyncRange();
        const syncStart = startDate || defaultRange.startDate;
        const syncEnd = endDate || defaultRange.endDate;
        await dataService.syncTransactions(syncStart, syncEnd);
      } else if (integrationType === 'metaAds') {
        const defaultRange = getMetaAdsSyncRange();
        const syncStart = startDate || defaultRange.startDate;
        const syncEnd = endDate || defaultRange.endDate;
        await dataService.syncMetaAds(syncStart, syncEnd);
      }
      // Refresh status after sync
      await loadSyncStatus();
    } catch (err) {
      console.error('Sync failed:', err);
      setActionError(err.message || 'Failed to sync integration. Please try again.');
      if (integrationType === 'metaAds') {
        setMetaAdsModalError(err.message || null);
        setShowMetaAdsModal(true);
      }
      throw err;
    }
  }, [getTransactionsSyncRange, getMetaAdsSyncRange, loadSyncStatus]);

  const handleConnect = useCallback(async (integrationType) => {
    try {
      setActionError(null);
      setIntegrationLoading(integrationType, true);

      if (integrationType === 'metaAds') {
        // Show manual token modal instead of OAuth
        setShowMetaAdsModal(true);
        setMetaAdsModalError(null);
        setIntegrationLoading(integrationType, false);
        return;
      }

      await dataService.updateIntegrationConnection(integrationType, true);

      const { startDate: defaultStart, endDate: defaultEnd } = getTransactionsSyncRange();
      await dataService.syncTransactions(defaultStart, defaultEnd);
      await loadSyncStatus();
    } catch (err) {
      console.error('Connect failed:', err);
      setActionError(err.message || 'Failed to connect integration. Please try again.');
    } finally {
      setIntegrationLoading(integrationType, false);
    }
  }, [getTransactionsSyncRange, loadSyncStatus, setIntegrationLoading]);

  const handleMetaAdsManualConnect = useCallback(async (accessToken, accountId, accountName, accessTokenExpiresAt) => {
    try {
      setMetaAdsModalError(null);
      setIntegrationLoading('metaAds', true);

      await dataService.connectMetaAdsManual(accessToken, accountId, accountName, accessTokenExpiresAt);
      await loadSyncStatus();

      setShowMetaAdsModal(false);
      setActionError(null);
    } catch (err) {
      console.error('Meta Ads manual connect failed:', err);
      setMetaAdsModalError(err.message || 'Failed to connect Meta Ads. Please check your credentials.');
    } finally {
      setIntegrationLoading('metaAds', false);
    }
  }, [loadSyncStatus, setIntegrationLoading]);

  const handleDisconnect = useCallback(async (integrationType) => {
    try {
      setActionError(null);
      setIntegrationLoading(integrationType, true);
      await dataService.updateIntegrationConnection(integrationType, false);

      if (integrationType === 'metaAds') {
        await dataService.disconnectMetaAds();
      }
      await loadSyncStatus();
    } catch (err) {
      console.error('Disconnect failed:', err);
      setActionError(err.message || 'Failed to disconnect integration. Please try again.');
    } finally {
      setIntegrationLoading(integrationType, false);
    }
  }, [loadSyncStatus, setIntegrationLoading]);

  const integrations = [
    {
      id: 'transactions',
      name: t.integrations.ommeoTransactions,
      description: t.integrations.ommeoTransactionsDesc,
      icon: FiActivity,
      connected: syncStatus?.transactions?.connected || false,
      lastSync: syncStatus?.transactions?.lastSync,
      status: syncStatus?.transactions?.status || 'disconnected',
      onSync: () => handleSync('transactions'),
      onConnect: () => handleConnect('transactions'),
      onDisconnect: () => handleDisconnect('transactions'),
      loading: !!actionLoading.transactions,
    },
    {
      id: 'metaAds',
      name: t.integrations.metaAds,
      description: t.integrations.metaAdsDesc,
      icon: FiTrendingUp,
      connected: syncStatus?.metaAds?.connected || false,
      lastSync: syncStatus?.metaAds?.lastSync,
      status: syncStatus?.metaAds?.status || 'disconnected',
      onSync: () => handleSync('metaAds'),
      onConnect: () => handleConnect('metaAds'),
      onDisconnect: () => handleDisconnect('metaAds'),
      loading: !!actionLoading.metaAds,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message="Loading integrations..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadSyncStatus}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {t.common.retry}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t.integrations.title}</h1>
        <p className="mt-2 text-gray-600">
          {t.integrations.subtitle}
        </p>
      </div>

      {/* Integration Cards */}
      {actionError && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {actionError}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            name={integration.name}
            description={integration.description}
            icon={integration.icon}
            connected={integration.connected}
            lastSync={integration.lastSync}
            status={integration.status}
            onConnect={integration.onConnect}
            onDisconnect={integration.onDisconnect}
            onSync={integration.onSync}
            loading={integration.loading}
          />
        ))}
      </div>

      {/* Sync Status Summary */}
      {syncStatus && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Status Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['transactions', 'metaAds'].map((key) => {
              const value = syncStatus[key];
              if (!value) return null;
              const label =
                key === 'transactions'
                  ? t.integrations.ommeoTransactions
                  : t.integrations.metaAds;
              return (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {value.connected ? '✓' : '○'}
                  </div>
                  <div className="text-sm text-gray-600">{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Meta Ads Manual Token Modal */}
      <MetaAdsManualTokenModal
        isOpen={showMetaAdsModal}
        onClose={() => {
          setShowMetaAdsModal(false);
          setMetaAdsModalError(null);
        }}
        onSubmit={handleMetaAdsManualConnect}
        loading={actionLoading.metaAds}
        error={metaAdsModalError}
      />
    </div>
  );
};

export default Integrations;
