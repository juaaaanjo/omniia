import { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiCalendar, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import dataService from '../../services/dataService';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const PeriodComparisonCard = () => {
  const { t, translate } = useLanguage();
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Date range state
  const [currentPeriod, setCurrentPeriod] = useState({
    startDate: getDefaultDateRange().current.start,
    endDate: getDefaultDateRange().current.end,
  });
  const [previousPeriod, setPreviousPeriod] = useState({
    startDate: getDefaultDateRange().previous.start,
    endDate: getDefaultDateRange().previous.end,
  });

  // Calculate default date ranges (last 30 days vs previous 30 days)
  function getDefaultDateRange() {
    const today = new Date();
    const currentEnd = new Date(today);
    const currentStart = new Date(today);
    currentStart.setDate(currentStart.getDate() - 30);

    const previousEnd = new Date(currentStart);
    previousEnd.setDate(previousEnd.getDate() - 1);
    const previousStart = new Date(previousEnd);
    previousStart.setDate(previousStart.getDate() - 30);

    return {
      current: {
        start: currentStart.toISOString().split('T')[0],
        end: currentEnd.toISOString().split('T')[0],
      },
      previous: {
        start: previousStart.toISOString().split('T')[0],
        end: previousEnd.toISOString().split('T')[0],
      },
    };
  }

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, we'll use current period dates
      // Backend will calculate the comparison with previous period
      const data = await dataService.getPeriodComparison(
        currentPeriod.startDate,
        currentPeriod.endDate
      );
      setComparison(data);
    } catch (err) {
      console.error('Failed to load period comparison:', err);
      setError(err.message || translate('dashboard.comparison.errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const getChangeColor = (change) => {
    if (!change && change !== 0) return 'text-gray-500';
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getChangeBgColor = (change) => {
    if (!change && change !== 0) return 'bg-gray-50';
    if (change > 0) return 'bg-green-50';
    if (change < 0) return 'bg-red-50';
    return 'bg-gray-50';
  };

  const getChangeIcon = (change) => {
    if (!change && change !== 0) return null;
    if (change > 0) return <FiTrendingUp className="w-4 h-4" />;
    if (change < 0) return <FiTrendingDown className="w-4 h-4" />;
    return null;
  };

  const formatMetricValue = (key, value) => {
    if (value === null || value === undefined) return 'N/A';

    switch (key) {
      case 'revenue':
      case 'adSpend':
      case 'profit':
        return formatCurrency(value);
      case 'roas':
        return `${value.toFixed(2)}x`;
      case 'ctr':
      case 'conversionRate':
        return formatPercentage(value);
      default:
        return typeof value === 'number' ? value.toLocaleString() : value;
    }
  };

  if (loading && !comparison) {
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
            onClick={loadComparison}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {translate('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  // If no comparison data available
  if (!comparison || !comparison.metrics) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {translate('dashboard.comparison.title')}
            </h2>
            <p className="text-sm text-gray-500">
              {translate('dashboard.comparison.subtitle')}
            </p>
          </div>
          <button
            onClick={loadComparison}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors self-end md:self-auto"
            type="button"
          >
            <FiRefreshCw className="h-4 w-4" />
            {translate('common.refresh')}
          </button>
        </div>
        <div className="mt-6 text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">{translate('dashboard.comparison.noData')}</p>
          <p className="text-sm text-gray-500">{translate('dashboard.comparison.needsData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {translate('dashboard.comparison.title')}
          </h2>
          <p className="text-sm text-gray-500">
            {translate('dashboard.comparison.subtitle')}
          </p>
          {comparison.periods && (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
              <span>
                {translate('dashboard.comparison.currentPeriod')}: {comparison.periods.current?.startDate} - {comparison.periods.current?.endDate}
              </span>
              <FiArrowRight className="w-3 h-3" />
              <span>
                {translate('dashboard.comparison.previousPeriod')}: {comparison.periods.previous?.startDate} - {comparison.periods.previous?.endDate}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={loadComparison}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 self-end md:self-auto"
          type="button"
        >
          <FiRefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {translate('common.refresh')}
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(comparison.metrics).map(([key, data]) => {
          const change = data.change || 0;
          const changePercent = data.changePercent || 0;

          return (
            <div key={key} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-3 capitalize">
                {translate(`dashboard.comparison.metrics.${key}`) || key.replace('_', ' ')}
              </p>

              {/* Current Period */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">
                  {translate('dashboard.comparison.current')}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatMetricValue(key, data.current)}
                </p>
              </div>

              {/* Previous Period */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">
                  {translate('dashboard.comparison.previous')}
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {formatMetricValue(key, data.previous)}
                </p>
              </div>

              {/* Change */}
              <div className={`flex items-center justify-between pt-3 border-t border-gray-200 rounded px-2 py-1 ${getChangeBgColor(changePercent)}`}>
                <span className="text-xs text-gray-600">
                  {translate('dashboard.comparison.change')}
                </span>
                <div className={`flex items-center gap-1 font-bold text-sm ${getChangeColor(changePercent)}`}>
                  {getChangeIcon(changePercent)}
                  <span>
                    {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Insight */}
      {comparison.insight && (
        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-2">
            <FiTrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">
                {translate('dashboard.comparison.insight')}
              </p>
              <p className="text-sm text-blue-700">{comparison.insight}</p>
            </div>
          </div>
        </div>
      )}

      {/* Trend Analysis */}
      {comparison.trend && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-start gap-2">
            <FiCalendar className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {translate('dashboard.comparison.trend')}
              </p>
              <p className="text-sm text-gray-700">{comparison.trend}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodComparisonCard;
