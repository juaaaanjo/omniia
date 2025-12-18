import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import IntegrationCard from '../components/integrations/IntegrationCard';
import MetaAdsManualTokenModal from '../components/integrations/MetaAdsManualTokenModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiTrendingUp, FiActivity, FiFileText } from 'react-icons/fi';
import dataService from '../services/dataService';
import { useExcelTransactions } from '../hooks/useExcelTransactions';
import { useDataSource } from '../hooks/useDataSource';
import { ROUTES } from '../utils/constants';

const Integrations = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { uploads } = useExcelTransactions();
  const { isDataSourceEnabled, loading: dataSourceLoading } = useDataSource();
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
      } else if (integrationType === 'meta-ads') {
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
      if (integrationType === 'meta-ads') {
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

      if (integrationType === 'meta-ads') {
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
      await loadSyncStatus();
    } catch (err) {
      console.error('Disconnect failed:', err);
      setActionError(err.message || 'Failed to disconnect integration. Please try again.');
    } finally {
      setIntegrationLoading(integrationType, false);
    }
  }, [loadSyncStatus, setIntegrationLoading]);

  // Build integrations array with only enabled data sources
  const allIntegrations = [
    {
      id: 'transactions',
      dataSource: 'transactions',
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
      dataSource: 'metaAds',
      name: t.integrations.metaAds,
      description: t.integrations.metaAdsDesc,
      icon: FiTrendingUp,
      connected: syncStatus?.metaAds?.connected || false,
      lastSync: syncStatus?.metaAds?.lastSync,
      status: syncStatus?.metaAds?.status || 'disconnected',
      onSync: () => handleSync('meta-ads'),
      onConnect: () => handleConnect('meta-ads'),
      onDisconnect: () => handleDisconnect('meta-ads'),
      loading: !!actionLoading.metaAds,
    },
    {
      id: 'excelTransactions',
      dataSource: 'excelTransactions',
      name: 'Excel Transactions',
      description: 'Upload and analyze transaction data from Excel files (.xlsx, .xls, .ods)',
      icon: FiFileText,
      connected: uploads && uploads.length > 0,
      lastSync: uploads && uploads.length > 0 ? uploads[0]?.uploadedAt : null,
      status: uploads && uploads.length > 0 ? 'connected' : 'disconnected',
      onConnect: () => navigate(ROUTES.EXCEL_TRANSACTIONS),
      onSync: () => navigate(ROUTES.EXCEL_TRANSACTIONS),
      onSettings: () => navigate(ROUTES.EXCEL_TRANSACTIONS),
      loading: false,
    },
  ];

  // Filter integrations based on user's enabled data sources
  const integrations = allIntegrations.filter(integration =>
    isDataSourceEnabled(integration.dataSource)
  );

  if (loading || dataSourceLoading) {
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
    <div className="space-y-section">
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
        <div className="card p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">Sync Status Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {integrations.map((integration) => {
              let connected = false;

              if (integration.id === 'transactions') {
                connected = syncStatus.transactions?.connected || false;
              } else if (integration.id === 'metaAds') {
                connected = syncStatus.metaAds?.connected || false;
              } else if (integration.id === 'excelTransactions') {
                connected = uploads && uploads.length > 0;
              }

              return (
                <div key={integration.id} className="text-center">
                  <div className="text-2xl font-medium text-gray-900">
                    {connected ? '✓' : '○'}
                  </div>
                  <div className="text-sm font-normal text-gray-600">{integration.name}</div>
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
