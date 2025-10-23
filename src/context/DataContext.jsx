import { createContext, useState, useCallback, useEffect, useRef } from 'react';
import dataService from '../services/dataService';
import { useAuth } from '../hooks/useAuth';

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [marketingData, setMarketingData] = useState(null);
  const [financeData, setFinanceData] = useState(null);
  const [crossAnalysisData, setCrossAnalysisData] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('last_30_days');

  // Refs for deduplicating sync status requests
  const lastSyncFetchTime = useRef(0);
  const inFlightSyncRequest = useRef(null);

  // Fetch marketing data
  const fetchMarketingData = useCallback(async (range = dateRange, filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dataService.getMarketingData(range, filters);
      setMarketingData(data);
      setLastUpdated(new Date());
      return data;
    } catch (error) {
      setError(error.message || 'Failed to fetch marketing data');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  // Fetch finance data
  const fetchFinanceData = useCallback(async (range = dateRange, filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dataService.getFinanceData(range, filters);
      setFinanceData(data);
      setLastUpdated(new Date());
      return data;
    } catch (error) {
      setError(error.message || 'Failed to fetch finance data');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  // Fetch cross-analysis data
  const fetchCrossAnalysisData = useCallback(async (range = dateRange, filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await dataService.getCrossAnalysisData(range, filters);
      setCrossAnalysisData(data);
      setLastUpdated(new Date());
      return data;
    } catch (error) {
      setError(error.message || 'Failed to fetch cross-analysis data');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);

  // Fetch KPIs
  const fetchKPIs = useCallback(async (range = dateRange) => {
    try {
      const data = await dataService.getKPIs(range);
      setKpis(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch KPIs:', error);
      throw error;
    }
  }, [dateRange]);

  // Fetch sync status with request deduplication
  const fetchSyncStatus = useCallback(async () => {
    const now = Date.now();

    // If there's already a request in flight, return that promise
    if (inFlightSyncRequest.current) {
      console.log('[DataContext] Reusing in-flight sync status request');
      return inFlightSyncRequest.current;
    }

    // If last fetch was less than 3 seconds ago, skip
    if (now - lastSyncFetchTime.current < 3000) {
      console.log('[DataContext] Skipping sync status - fetched', Math.round((now - lastSyncFetchTime.current) / 1000), 'seconds ago');
      return Promise.resolve(syncStatus);
    }

    // Create new request
    console.log('[DataContext] Fetching sync status');
    lastSyncFetchTime.current = now;

    const request = dataService.getSyncStatus()
      .then(status => {
        setSyncStatus(status);
        inFlightSyncRequest.current = null;
        return status;
      })
      .catch(error => {
        console.error('Failed to fetch sync status:', error);
        inFlightSyncRequest.current = null;
        return null;
      });

    inFlightSyncRequest.current = request;
    return request;
  }, [syncStatus]);

  // Sync all data
  const syncAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await dataService.syncAllData();
      await fetchSyncStatus();
      return response;
    } catch (error) {
      setError(error.message || 'Failed to sync data');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchSyncStatus]);

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        fetchMarketingData(),
        fetchFinanceData(),
        fetchCrossAnalysisData(),
        fetchKPIs(),
        fetchSyncStatus(),
      ]);
    } catch (error) {
      console.error('Failed to refresh all data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchMarketingData, fetchFinanceData, fetchCrossAnalysisData, fetchKPIs, fetchSyncStatus]);

  // Export data
  const exportData = useCallback(async (type, format = 'csv') => {
    try {
      await dataService.exportData(type, dateRange, format);
    } catch (error) {
      setError(error.message || 'Failed to export data');
      throw error;
    }
  }, [dateRange]);

  // Update date range
  const updateDateRange = useCallback((newRange) => {
    setDateRange(newRange);
  }, []);

  // Fetch sync status periodically - only when authenticated
  useEffect(() => {
    // Don't fetch if not authenticated or still loading auth
    if (!isAuthenticated || authLoading) {
      return;
    }

    // Delay initial fetch to allow auth to fully initialize after login
    // Increased delay to prevent race conditions with token validation
    const initialTimeout = setTimeout(() => {
      fetchSyncStatus().catch(err => {
        // Silently handle errors on initial fetch to prevent auth issues
        console.warn('Initial sync status fetch failed (this is expected after fresh login):', err);
      });
    }, 2500); // 2.5 second delay for server-side token validation

    const interval = setInterval(() => {
      fetchSyncStatus().catch(err => {
        console.warn('Periodic sync status fetch failed:', err);
      });
    }, 300000); // Every 5 minutes

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]); // Re-run when auth state changes

  const value = {
    marketingData,
    financeData,
    crossAnalysisData,
    kpis,
    syncStatus,
    lastUpdated,
    isLoading,
    error,
    dateRange,
    fetchMarketingData,
    fetchFinanceData,
    fetchCrossAnalysisData,
    fetchKPIs,
    fetchSyncStatus,
    syncAllData,
    refreshAllData,
    exportData,
    updateDateRange,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
