import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { formatCurrency, formatPercentage, formatNumber } from '../../utils/formatters';
import clsx from 'clsx';

const MetricCard = ({
  title,
  value,
  change,
  type = 'number',
  icon: Icon,
  trend = 'up',
  loading = false,
  currency = 'USD', // Default currency
}) => {
  const formatValue = (val) => {
    if (loading) return '...';
    if (val === null || val === undefined) return '-';

    switch (type) {
      case 'currency':
        return formatCurrency(val, currency);
      case 'percentage':
        return formatPercentage(val);
      case 'number':
        return formatNumber(val);
      default:
        return val;
    }
  };

  const isPositive = change >= 0;
  const TrendIcon = isPositive ? FiTrendingUp : FiTrendingDown;

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {formatValue(value)}
          </p>
          {change !== undefined && change !== null && (
            <div className="flex items-center space-x-1">
              <TrendIcon
                className={clsx(
                  'w-4 h-4',
                  isPositive ? 'text-green-600' : 'text-red-600'
                )}
              />
              <span
                className={clsx(
                  'text-sm font-medium',
                  isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {Math.abs(change).toFixed(2)}%
              </span>
              <span className="text-sm text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
