import { useState, useEffect } from 'react';
import { FiActivity, FiTrendingUp, FiFileText } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { useExcelTransactions } from '../../hooks/useExcelTransactions';
import { useDataSource } from '../../hooks/useDataSource';

const DataSourceSelector = ({ value, onChange, className = '' }) => {
  const { user } = useAuth();
  const { uploads } = useExcelTransactions();
  const { isDataSourceEnabled } = useDataSource();
  const [selectedSource, setSelectedSource] = useState(value || 'ommeo');

  // Update internal state when external value changes
  useEffect(() => {
    if (value) {
      setSelectedSource(value);
    }
  }, [value]);

  const dataSources = [
    {
      id: 'ommeo',
      name: 'Ommeo Transactions',
      icon: FiActivity,
      enabled: isDataSourceEnabled('transactions'),
      available: (user?.integrations?.transactions?.connected || false) && isDataSourceEnabled('transactions'),
      color: 'blue'
    },
    {
      id: 'meta',
      name: 'Meta Ads',
      icon: FiTrendingUp,
      enabled: isDataSourceEnabled('metaAds'),
      available: (user?.integrations?.metaAds?.connected || false) && isDataSourceEnabled('metaAds'),
      color: 'indigo'
    },
    {
      id: 'excel',
      name: 'Excel Transactions',
      icon: FiFileText,
      enabled: isDataSourceEnabled('excelTransactions'),
      available: ((uploads && uploads.length > 0) || user?.integrations?.excelTransactions?.connected || false) && isDataSourceEnabled('excelTransactions'),
      color: 'green'
    }
  ].filter(source => source.enabled); // Only show enabled data sources

  const handleSourceChange = (sourceId) => {
    setSelectedSource(sourceId);
    if (onChange) {
      onChange(sourceId);
    }
  };

  const getColorClasses = (color, isSelected, isAvailable) => {
    if (!isAvailable) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    }

    if (isSelected) {
      const colorMap = {
        blue: 'bg-blue-100 text-blue-700 border-blue-500',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-500',
        green: 'bg-green-100 text-green-700 border-green-500'
      };
      return colorMap[color] || 'bg-blue-100 text-blue-700 border-blue-500';
    }

    return 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50';
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700">Data Source:</span>
      <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
        {dataSources.map((source) => {
          const Icon = source.icon;
          const isSelected = selectedSource === source.id;
          const isAvailable = source.available;

          return (
            <button
              key={source.id}
              onClick={() => isAvailable && handleSourceChange(source.id)}
              disabled={!isAvailable}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium
                transition-all duration-200 border-2
                ${getColorClasses(source.color, isSelected, isAvailable)}
                ${isSelected ? 'shadow-sm' : 'border-transparent'}
              `}
              title={!isAvailable ? 'Not connected' : source.name}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{source.name}</span>
              {!isAvailable && (
                <span className="text-xs opacity-60">(disconnected)</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DataSourceSelector;
