import { useEffect, useState } from 'react';
import {
  FiAlertTriangle,
  FiAlertCircle,
  FiInfo,
  FiTrendingDown,
  FiTrendingUp,
  FiRefreshCw,
  FiZap
} from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import dataService from '../../services/dataService';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';

const AnomalyDetectionCard = () => {
  const { t, translate } = useLanguage();
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnomalies();
  }, []);

  const loadAnomalies = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load anomalies for the last 30 days
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      const startDateStr = startDate.toISOString().split('T')[0];

      const data = await dataService.getAnomalies(startDateStr, endDate);
      setAnomalies(data.anomalies || []);
    } catch (err) {
      console.error('Failed to load anomalies:', err);
      setError(err.message || translate('dashboard.anomalies.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <FiAlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <FiAlertCircle className="w-5 h-5" />;
      case 'low':
        return <FiInfo className="w-5 h-5" />;
      default:
        return <FiInfo className="w-5 h-5" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'revenue_drop':
      case 'conversion_drop':
        return <FiTrendingDown className="w-4 h-4 text-red-500" />;
      case 'revenue_spike':
      case 'conversion_spike':
        return <FiTrendingUp className="w-4 h-4 text-green-500" />;
      case 'cost_spike':
        return <FiTrendingUp className="w-4 h-4 text-red-500" />;
      default:
        return <FiZap className="w-4 h-4 text-orange-500" />;
    }
  };

  const getTypeLabel = (type) => {
    return translate(`dashboard.anomalies.types.${type}`) || type.replace('_', ' ');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner size="lg" message={translate('common.loading')} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col items-center justify-center h-48 text-gray-500">
          <p className="mb-4">{error}</p>
          <button
            onClick={loadAnomalies}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {translate('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {translate('dashboard.anomalies.title')}
          </h2>
          <p className="text-sm text-gray-500">
            {translate('dashboard.anomalies.subtitle')}
          </p>
          {anomalies.length > 0 && (
            <p className="mt-2 text-xs text-gray-400">
              {translate('dashboard.anomalies.detected', { count: anomalies.length })}
            </p>
          )}
        </div>
        <button
          onClick={loadAnomalies}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 self-end md:self-auto"
          type="button"
        >
          <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {translate('common.refresh')}
        </button>
      </div>

      {/* Anomalies List */}
      {anomalies.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <FiZap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">{translate('dashboard.anomalies.noAnomalies')}</p>
          <p className="text-sm text-gray-500">{translate('dashboard.anomalies.allGood')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {anomalies.map((anomaly, index) => (
            <div
              key={anomaly.id || index}
              className={`rounded-lg border p-4 ${getSeverityColor(anomaly.severity)}`}
            >
              <div className="flex items-start gap-3">
                {/* Severity Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {getSeverityIcon(anomaly.severity)}
                </div>

                <div className="flex-1">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">
                        {anomaly.metric || translate('dashboard.anomalies.unknown')}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-white border border-current">
                        {getTypeIcon(anomaly.type)}
                        {getTypeLabel(anomaly.type)}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-white border border-current capitalize">
                        {translate(`dashboard.anomalies.severity.${anomaly.severity}`) || anomaly.severity}
                      </span>
                    </div>
                    {anomaly.detectedAt && (
                      <span className="text-xs text-gray-600 whitespace-nowrap">
                        {formatRelativeTime(anomaly.detectedAt)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-3">
                    {anomaly.description || translate('dashboard.anomalies.noDescription')}
                  </p>

                  {/* Metrics */}
                  {anomaly.value !== undefined && (
                    <div className="flex flex-wrap gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">{translate('dashboard.anomalies.current')}:</span>{' '}
                        <span className="font-semibold text-gray-900">
                          {anomaly.metric?.includes('revenue') || anomaly.metric?.includes('spend')
                            ? formatCurrency(anomaly.value)
                            : anomaly.value}
                        </span>
                      </div>
                      {anomaly.expected !== undefined && (
                        <div>
                          <span className="text-gray-600">{translate('dashboard.anomalies.expected')}:</span>{' '}
                          <span className="font-semibold text-gray-900">
                            {anomaly.metric?.includes('revenue') || anomaly.metric?.includes('spend')
                              ? formatCurrency(anomaly.expected)
                              : anomaly.expected}
                          </span>
                        </div>
                      )}
                      {anomaly.deviation !== undefined && (
                        <div>
                          <span className="text-gray-600">{translate('dashboard.anomalies.deviation')}:</span>{' '}
                          <span className="font-semibold text-gray-900">
                            {anomaly.deviation >= 0 ? '+' : ''}{anomaly.deviation.toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Impact */}
                  {anomaly.impact && (
                    <div className="text-sm">
                      <span className="text-gray-600">{translate('dashboard.anomalies.impact')}:</span>{' '}
                      <span className="font-medium text-gray-900">{anomaly.impact}</span>
                    </div>
                  )}

                  {/* Recommendation */}
                  {anomaly.recommendation && (
                    <div className="mt-3 p-3 bg-white rounded border border-current">
                      <p className="text-sm">
                        <span className="font-semibold">{translate('dashboard.anomalies.recommendation')}:</span>{' '}
                        {anomaly.recommendation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnomalyDetectionCard;
