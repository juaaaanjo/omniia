import { createContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useExcelTransactions } from '../hooks/useExcelTransactions';
import dataService from '../services/dataService';

export const DataSourceContext = createContext(null);

export const DataSourceProvider = ({ children }) => {
  const { user } = useAuth();
  const { uploads } = useExcelTransactions();
  const [selectedDataSource, setSelectedDataSource] = useState('ommeo');
  const [enabledDataSources, setEnabledDataSources] = useState([]);
  const [availableSources, setAvailableSources] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch user's enabled data sources
  useEffect(() => {
    const fetchDataSources = async () => {
      try {
        setLoading(true);
        const response = await dataService.getAvailableDataSources();
        setEnabledDataSources(response.enabledDataSources || []);
        setAvailableSources(response.availableSources || {});
      } catch (error) {
        console.error('Failed to fetch data sources:', error);
        // Fallback to user object if API fails
        if (user?.enabledDataSources) {
          setEnabledDataSources(user.enabledDataSources);
          setAvailableSources({
            metaAds: user.enabledDataSources.includes('metaAds'),
            transactions: user.enabledDataSources.includes('transactions'),
            excelTransactions: user.enabledDataSources.includes('excelTransactions')
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDataSources();
    }
  }, [user]);

  // Auto-select first available data source
  useEffect(() => {
    if (user && !loading) {
      // Priority: Ommeo > Excel > Meta
      if (availableSources.transactions && user?.integrations?.transactions?.connected) {
        setSelectedDataSource('ommeo');
      } else if (availableSources.excelTransactions && uploads && uploads.length > 0) {
        setSelectedDataSource('excel');
      } else if (availableSources.metaAds && user?.integrations?.metaAds?.connected) {
        setSelectedDataSource('meta');
      }
    }
  }, [user, uploads, availableSources, loading]);

  const changeDataSource = useCallback((source) => {
    setSelectedDataSource(source);
  }, []);

  const getAvailableDataSources = useCallback(() => {
    return {
      ommeo: (availableSources.transactions && user?.integrations?.transactions?.connected) || false,
      meta: (availableSources.metaAds && user?.integrations?.metaAds?.connected) || false,
      excel: (availableSources.excelTransactions && ((uploads && uploads.length > 0) || user?.integrations?.excelTransactions?.connected)) || false
    };
  }, [user, uploads, availableSources]);

  const isDataSourceEnabled = useCallback((source) => {
    const sourceMap = {
      'ommeo': 'transactions',
      'meta': 'metaAds',
      'excel': 'excelTransactions',
      'transactions': 'transactions',
      'metaAds': 'metaAds',
      'excelTransactions': 'excelTransactions'
    };
    return availableSources[sourceMap[source]] || false;
  }, [availableSources]);

  const value = {
    selectedDataSource,
    changeDataSource,
    getAvailableDataSources,
    isDataSourceAvailable: (source) => getAvailableDataSources()[source] || false,
    isDataSourceEnabled,
    enabledDataSources,
    availableSources,
    loading
  };

  return (
    <DataSourceContext.Provider value={value}>
      {children}
    </DataSourceContext.Provider>
  );
};
