import { useEffect, useState } from 'react';
import { FiTrendingUp, FiTrendingDown, FiTarget, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import dataService from '../../services/dataService';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const ForecastAccuracyCard = () => {
  const { t, translate } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAccuracyStats();
  }, []);

  const loadAccuracyStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dataService.getForecastAccuracyStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load forecast accuracy stats:', err);
      setError(err.message || translate('forecasting.accuracy.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const getAccuracyColor = (accuracy) => {
    if (!accuracy && accuracy !== 0) return 'text-gray-500';
    if (accuracy >= 0.8) return 'text-green-600';
    if (accuracy >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyBgColor = (accuracy) => {
    if (!accuracy && accuracy !== 0) return 'bg-gray-100';
    if (accuracy >= 0.8) return 'bg-green-50 border-green-200';
    if (accuracy >= 0.6) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getTrendIcon = (trend) => {
    if (!trend || trend === 'stable') return <FiTarget className="w-4 h-4 text-gray-500" />;
    if (trend === 'improving') return <FiTrendingUp className="w-4 h-4 text-green-600" />;
    return <FiTrendingDown className="w-4 h-4 text-red-600" />;
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
        <div className="flex items-center justify-center h-48 text-gray-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // If no stats available, show empty state
  if (!stats || stats.totalForecasts === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {translate('forecasting.accuracy.title')}
            </h2>
            <p className="text-sm text-gray-500">
              {translate('forecasting.accuracy.subtitle')}
            </p>
          </div>
          <button
            onClick={() => navigate('/forecasting')}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            type="button"
          >
            <FiBarChart2 className="h-4 w-4" />
            {translate('forecasting.title')}
          </button>
        </div>
        <div className="mt-6 text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <FiBarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">{translate('forecasting.accuracy.noData')}</p>
          <p className="text-sm text-gray-500">{translate('forecasting.accuracy.startTracking')}</p>
        </div>
      </div>
    );
  }

  const overallAccuracy = stats.overallAccuracy || 0;
  const byType = stats.byType || {};

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {translate('forecasting.accuracy.title')}
          </h2>
          <p className="text-sm text-gray-500">
            {translate('forecasting.accuracy.subtitle')}
          </p>
          {stats.totalForecasts && (
            <p className="mt-2 text-xs text-gray-400">
              {translate('forecasting.accuracy.totalForecasts', {
                count: stats.totalForecasts,
              })}
            </p>
          )}
        </div>
        <button
          onClick={() => navigate('/forecasting')}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors self-end md:self-auto"
          type="button"
        >
          <FiBarChart2 className="h-4 w-4" />
          {translate('forecasting.title')}
        </button>
      </div>

      {/* Overall Accuracy */}
      <div className={`mt-6 rounded-xl border p-6 ${getAccuracyBgColor(overallAccuracy)}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              {translate('forecasting.accuracy.overallAccuracy')}
            </p>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold ${getAccuracyColor(overallAccuracy)}`}>
                {formatPercentage(overallAccuracy)}
              </span>
              {stats.trend && (
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  {getTrendIcon(stats.trend)}
                  {translate(`forecasting.accuracy.trend.${stats.trend}`)}
                </span>
              )}
            </div>
          </div>
          {stats.averageVariance !== undefined && (
            <div className="text-right">
              <p className="text-xs text-gray-600 mb-1">
                {translate('forecasting.accuracy.avgVariance')}
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {formatPercentage(Math.abs(stats.averageVariance))}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Accuracy by Type */}
      {Object.keys(byType).length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            {translate('forecasting.accuracy.byType')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(byType).map(([type, data]) => (
              <div
                key={type}
                className="rounded-lg border border-gray-200 bg-white/60 p-4 shadow-sm"
              >
                <p className="text-xs font-medium text-gray-600 mb-2">
                  {translate(`forecasting.forecastTypes.${type}`) || type}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${getAccuracyColor(data.accuracy)}`}>
                    {formatPercentage(data.accuracy || 0)}
                  </span>
                </div>
                {data.count && (
                  <p className="text-xs text-gray-500 mt-1">
                    {translate('forecasting.accuracy.forecasts', { count: data.count })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Insight */}
      {stats.recentInsight && (
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-2">
            <FiTarget className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">
                {translate('forecasting.accuracy.insight')}
              </p>
              <p className="text-sm text-blue-700">{stats.recentInsight}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate('/forecasting')}
          className="w-full flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-gray-50"
          type="button"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-gray-200 p-3 text-blue-600">
              <FiBarChart2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {translate('forecasting.accuracy.viewDetails')}
              </p>
              <p className="text-xs text-gray-500">
                {translate('forecasting.accuracy.recordMore')}
              </p>
            </div>
          </div>
          <FiArrowRight className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default ForecastAccuracyCard;
