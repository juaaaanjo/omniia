import {
  FiDollarSign,
  FiCreditCard,
  FiTrendingDown,
  FiTrendingUp,
  FiCheckCircle,
  FiXCircle,
  FiRotateCcw,
  FiAward,
  FiCalendar,
} from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import { formatCurrency, formatDate } from '../../utils/formatters';
import Badge from '../common/Badge';

const PaymentMetrics = ({ payments, loading = false, dataSource, dateRange }) => {
  const { t } = useLanguage();

  if (!payments) {
    return null;
  }

  const hasRevenue = payments.totalRevenue != null;
  const hasNetRevenue = payments.netRevenue != null;
  const processingFees = hasRevenue && hasNetRevenue
    ? payments.totalRevenue - payments.netRevenue
    : null;
  const currency = payments.currency || 'USD';
  const formattedDateRange = dateRange
    ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
    : null;

  const metrics = [];

  if (hasRevenue) {
    metrics.push({
      id: 'totalRevenue',
      label: t.finance.totalRevenue,
      value: formatCurrency(payments.totalRevenue, currency),
      icon: FiDollarSign,
      iconClasses: 'text-blue-600',
      bgClasses: 'bg-blue-100',
    });
  }

  if (hasNetRevenue) {
    metrics.push({
      id: 'netRevenue',
      label: t.finance.netRevenue,
      value: formatCurrency(payments.netRevenue, currency),
      icon: FiTrendingUp,
      iconClasses: 'text-green-600',
      bgClasses: 'bg-green-100',
    });
  }

  if (processingFees != null) {
    metrics.push({
      id: 'processingFees',
      label: t.finance.processingFees,
      value: formatCurrency(processingFees, currency),
      icon: FiTrendingDown,
      iconClasses: 'text-red-600',
      bgClasses: 'bg-red-100',
      helper: t.finance.processingFeesHelper ?? 'Calculated from revenue - net',
    });
  }

  if (payments.totalProviderEarnings != null) {
    metrics.push({
      id: 'providerEarnings',
      label: t.finance.providerEarnings ?? 'Provider Earnings',
      value: formatCurrency(payments.totalProviderEarnings, currency),
      icon: FiAward,
      iconClasses: 'text-indigo-600',
      bgClasses: 'bg-indigo-100',
    });
  }

  if (payments.refundedAmount != null) {
    metrics.push({
      id: 'refundedAmount',
      label: t.finance.refundedAmount ?? 'Refunded Amount',
      value: formatCurrency(payments.refundedAmount, currency),
      icon: FiRotateCcw,
      iconClasses: 'text-orange-600',
      bgClasses: 'bg-orange-100',
    });
  }

  if (payments.successfulTransactions != null) {
    metrics.push({
      id: 'successfulTransactions',
      label: t.finance.successfulTransactions ?? 'Successful Transactions',
      value: payments.successfulTransactions.toLocaleString(),
      icon: FiCheckCircle,
      iconClasses: 'text-emerald-600',
      bgClasses: 'bg-emerald-100',
    });
  }

  if (payments.failedTransactions != null) {
    metrics.push({
      id: 'failedTransactions',
      label: t.finance.failedTransactions ?? 'Failed Transactions',
      value: payments.failedTransactions.toLocaleString(),
      icon: FiXCircle,
      iconClasses: 'text-rose-600',
      bgClasses: 'bg-rose-100',
    });
  }

  if (payments.totalTransactions != null) {
    metrics.push({
      id: 'totalTransactions',
      label: t.finance.totalTransactions,
      value: payments.totalTransactions.toLocaleString(),
      icon: FiCreditCard,
      iconClasses: 'text-purple-600',
      bgClasses: 'bg-purple-100',
    });
  }

  if (metrics.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t.finance.paymentMetrics}
            </h3>
            {formattedDateRange && (
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                <FiCalendar className="w-4 h-4" />
                <span>{formattedDateRange}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge color="blue" size="sm">
              {dataSource
                ? `${t.finance.dataSource}: ${dataSource}`
                : t.finance.usingOmmeoTransactions}
            </Badge>
          </div>
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(metrics.length || 4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map(({ id, label, value, icon: Icon, iconClasses, bgClasses, helper }) => (
              <div key={id} className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-10 h-10 ${bgClasses} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${iconClasses}`} />
                  </div>
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                {helper && (
                  <span className="text-xs text-gray-500 mt-1">
                    {helper}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMetrics;
