import { useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { useLanguage } from '../../hooks/useLanguage';
import LoadingSpinner from '../common/LoadingSpinner';
import Badge from '../common/Badge';
import PieChart from '../charts/PieChart';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';
import PaymentMetrics from './PaymentMetrics';
import { formatCurrency, formatDate, formatPercentage } from '../../utils/formatters';
import { CHART_COLORS } from '../../utils/constants';
import {
  FiDollarSign,
  FiTrendingDown,
  FiTrendingUp,
  FiPercent,
} from 'react-icons/fi';

const FinanceDashboard = () => {
  const { financeData, fetchFinanceData, isLoading, dateRange } = useData();
  const { t } = useLanguage();

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData, dateRange]);

  if (isLoading && !financeData) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message="Loading finance data..." />
      </div>
    );
  }

  if (!financeData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t.common.noData}</p>
      </div>
    );
  }

  const summary = financeData.summary || {};
  const paymentData = financeData.paymentData || {};
  const expensesByCategory = financeData.expensesByCategory || financeData.costsByCategory || [];
  const arAging = financeData.arAging || [];
  const revenueVsCosts = financeData.revenueVsCosts || [];
  const budgetVsActual = financeData.budgetVsActual || [];
  const cashFlow = financeData.cashFlow || [];
  const currency = paymentData.currency || 'USD';
  const dateRangeInfo = financeData.dateRange || null;
  const formattedDateRange = dateRangeInfo
    ? `${formatDate(dateRangeInfo.startDate)} - ${formatDate(dateRangeInfo.endDate)}`
    : null;
  const fallbackLabel = formattedDateRange || t.finance.currentPeriod || 'Current Period';

  const revenueVsCostsData = revenueVsCosts.length
    ? revenueVsCosts
    : [
        {
          date: fallbackLabel,
          revenue:
            (summary.revenue ?? 0) !== 0
              ? summary.revenue
              : paymentData.totalRevenue ?? 0,
          costs:
            (summary.expenses ?? 0) !== 0
              ? summary.expenses
              : (paymentData.totalRevenue ?? 0) - (paymentData.netRevenue ?? 0),
          profit:
            (summary.profit ?? 0) !== 0
              ? summary.profit
              : paymentData.netRevenue ?? 0,
        },
      ];

  const cashFlowData = cashFlow.length
    ? cashFlow
    : [
        {
          date: fallbackLabel,
          inflow: paymentData.totalRevenue ?? 0,
          outflow: (paymentData.totalRevenue ?? 0) - (paymentData.netRevenue ?? 0),
        },
      ];

  const budgetVsActualData = budgetVsActual.length
    ? budgetVsActual
    : [
        {
          category: t.finance.totalRevenue,
          budget: summary.revenue ?? paymentData.totalRevenue ?? 0,
          actual: paymentData.netRevenue ?? 0,
        },
        {
          category: t.finance.expenses ?? 'Expenses',
          budget: summary.expenses ?? ((paymentData.totalRevenue ?? 0) - (paymentData.netRevenue ?? 0)),
          actual: paymentData.totalProviderEarnings ?? 0,
        },
      ];

  const hasRevenueVsCosts = revenueVsCosts.length > 0 || revenueVsCostsData.some((item) =>
    (item.revenue ?? 0) !== 0 || (item.costs ?? 0) !== 0 || (item.profit ?? 0) !== 0
  );
  const hasCashFlow = cashFlow.length > 0 || cashFlowData.some((item) =>
    (item.inflow ?? 0) !== 0 || (item.outflow ?? 0) !== 0
  );
  const hasBudgetVsActual = budgetVsActual.length > 0 || budgetVsActualData.some((item) =>
    (item.budget ?? 0) !== 0 || (item.actual ?? 0) !== 0
  );

  const summaryCards = [
    {
      id: 'revenue',
      label: t.finance.totalRevenue,
      value: formatCurrency(summary.revenue ?? 0, currency),
      icon: FiDollarSign,
      bg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 'expenses',
      label: t.finance.expenses ?? 'Expenses',
      value: formatCurrency(summary.expenses ?? 0, currency),
      icon: FiTrendingDown,
      bg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      id: 'profit',
      label: t.finance.netProfit,
      value: formatCurrency(summary.profit ?? 0, currency),
      icon: FiTrendingUp,
      bg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'margin',
      label: t.finance.profitMargin,
      value:
        summary.margin !== undefined && summary.margin !== null
          ? formatPercentage(summary.margin)
          : '-',
      icon: FiPercent,
      bg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.finance.overview}</h1>
          {formattedDateRange && (
            <p className="mt-1 text-sm text-gray-500">
              {(t.finance.dateRangeLabel ?? 'Reporting period') + ': ' + formattedDateRange}
            </p>
          )}
        </div>
        {financeData.paymentDataSource && (
          <Badge color="blue" size="sm">
            {t.finance.dataSource}: {financeData.paymentDataSource}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map(({ id, label, value, icon: Icon, bg, iconColor }) => (
          <div key={id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {financeData.paymentData && (
        <PaymentMetrics
          payments={paymentData}
          loading={isLoading}
          dataSource={financeData.paymentDataSource}
          dateRange={financeData.dateRange}
        />
      )}

      {(hasRevenueVsCosts || hasCashFlow) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t.finance.revenueVsCosts ?? 'Revenue vs Costs'}
            </h3>
            {hasRevenueVsCosts ? (
              <LineChart
                data={revenueVsCostsData}
                lines={[
                  { dataKey: 'revenue', stroke: CHART_COLORS.success, name: t.finance.totalRevenue },
                  { dataKey: 'costs', stroke: CHART_COLORS.danger, name: t.finance.expenses ?? 'Expenses' },
                  { dataKey: 'profit', stroke: CHART_COLORS.primary, name: t.finance.netProfit },
                ]}
                xAxisKey="date"
                height={320}
              />
            ) : (
              <p className="text-sm text-gray-500">{t.common.noData}</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t.finance.cashFlow ?? 'Cash Flow'}
            </h3>
            {hasCashFlow ? (
              <LineChart
                data={cashFlowData}
                lines={[
                  { dataKey: 'inflow', stroke: CHART_COLORS.success, name: t.finance.inflow ?? 'Inflow' },
                  { dataKey: 'outflow', stroke: CHART_COLORS.danger, name: t.finance.outflow ?? 'Outflow' },
                ]}
                xAxisKey="date"
                height={320}
              />
            ) : (
              <p className="text-sm text-gray-500">{t.common.noData}</p>
            )}
          </div>
        </div>
      )}

      {hasBudgetVsActual && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.finance.budgetVsActual}
          </h3>
          <BarChart
            data={budgetVsActualData}
            bars={[
              { dataKey: 'budget', fill: CHART_COLORS.info, name: t.finance.budget ?? 'Budget' },
              { dataKey: 'actual', fill: CHART_COLORS.primary, name: t.finance.actual ?? 'Actual' },
            ]}
            xAxisKey="category"
            height={320}
            layout="horizontal"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.finance.expensesByCategory ?? 'Expenses by Category'}
          </h3>
          {expensesByCategory.length > 0 ? (
            <PieChart data={expensesByCategory} nameKey="category" dataKey="amount" height={320} />
          ) : (
            <p className="text-sm text-gray-500">{t.common.noData}</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t.finance.arAging ?? 'Accounts Receivable Aging'}
          </h3>
          {arAging.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-2">{t.finance.bucket ?? 'Bucket'}</th>
                    <th className="px-4 py-2">{t.finance.amount ?? 'Amount'}</th>
                    <th className="px-4 py-2">{t.finance.invoices ?? 'Invoices'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                  {arAging.map((item, index) => (
                    <tr key={`${item.bucket}-${index}`}>
                      <td className="px-4 py-3 capitalize">{item.bucket}</td>
                      <td className="px-4 py-3">
                        {formatCurrency(item.amount ?? 0, currency)}
                      </td>
                      <td className="px-4 py-3">
                        {item.count?.toLocaleString() ?? '0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t.common.noData}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
