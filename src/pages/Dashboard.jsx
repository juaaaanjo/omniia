import { useEffect, useMemo } from 'react';
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiPercent } from 'react-icons/fi';
import { useData } from '../hooks/useData';
import MetricCard from '../components/charts/MetricCard';
import PaymentMetrics from '../components/dashboard/PaymentMetrics';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const Dashboard = () => {
  const { kpis, fetchKPIs, isLoading, dateRange } = useData();

  useEffect(() => {
    fetchKPIs();
  }, [fetchKPIs, dateRange]);

  const { revenue = {}, marketing = {}, payments = {}, finance = {}, dateRange: kpiDateRange } = kpis || {};

  const marginValue =
    finance.margin != null && !Number.isNaN(finance.margin) ? finance.margin / 100 : null;

  const summaryCards = useMemo(
    () => [
      {
        title: 'Finance Revenue',
        value: finance.revenue ?? payments.totalRevenue ?? 0,
        change: null,
        type: 'currency',
        icon: FiDollarSign,
      },
      {
        title: 'Finance Profit',
        value: finance.profit ?? 0,
        change: null,
        type: 'currency',
        icon: FiTrendingUp,
      },
      {
        title: 'Total Transactions',
        value: payments.totalTransactions ?? 0,
        change: null,
        type: 'number',
        icon: FiShoppingCart,
      },
      {
        title: 'Profit Margin',
        value: marginValue ?? 0,
        change: null,
        type: 'percentage',
        icon: FiPercent,
      },
    ],
    [finance.profit, finance.revenue, marginValue, payments.totalRevenue, payments.totalTransactions]
  );

  const marginDisplay =
    finance.margin != null && !Number.isNaN(finance.margin)
      ? formatPercentage(finance.margin / 100)
      : formatPercentage(0);

  const detailSections = [
    {
      title: 'Revenue KPIs',
      items: [
        { label: 'Total Revenue', value: formatCurrency(revenue.total ?? 0) },
        { label: 'Orders', value: (revenue.orders ?? 0).toLocaleString() },
        { label: 'Average Order Value', value: formatCurrency(revenue.avgOrderValue ?? 0) },
      ],
    },
    {
      title: 'Marketing KPIs',
      items: [
        { label: 'Total Spend', value: formatCurrency(marketing.totalSpend ?? 0) },
        { label: 'Impressions', value: (marketing.impressions ?? 0).toLocaleString() },
        { label: 'Clicks', value: (marketing.clicks ?? 0).toLocaleString() },
        { label: 'ROAS', value: (marketing.roas ?? 0).toFixed(2) },
        { label: 'CPC', value: formatCurrency(marketing.cpc ?? 0) },
      ],
    },
    {
      title: 'Finance KPIs',
      items: [
        { label: 'Revenue', value: formatCurrency(finance.revenue ?? 0) },
        { label: 'Expenses', value: formatCurrency(finance.expenses ?? 0) },
        { label: 'Profit', value: formatCurrency(finance.profit ?? 0) },
        { label: 'Margin', value: marginDisplay },
      ],
    },
  ];

  if (isLoading && !kpis) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your business performance across all areas</p>
        {kpiDateRange && (
          <p className="mt-1 text-sm text-gray-500">
            Reporting period:{' '}
            {new Date(kpiDateRange.startDate).toLocaleDateString()} -{' '}
            {new Date(kpiDateRange.endDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <MetricCard key={card.title} {...card} loading={isLoading} />
        ))}
      </div>

      {payments && Object.keys(payments).length > 0 && (
        <PaymentMetrics
          payments={payments}
          loading={isLoading}
          dataSource={payments.source}
          dateRange={kpiDateRange}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {detailSections.map((section) => (
          <div key={section.title} className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
            <dl className="space-y-3">
              {section.items.map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <dt className="font-medium text-gray-700">{label}</dt>
                  <dd className="text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
