import { useEffect, useMemo } from 'react';
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiPercent } from 'react-icons/fi';
import { useData } from '../hooks/useData';
import MetricCard from '../components/charts/MetricCard';
import PaymentMetrics from '../components/dashboard/PaymentMetrics';
import EioOverviewCard from '../components/eio/EioOverviewCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { useLanguage } from '../hooks/useLanguage';

const Dashboard = () => {
  const { kpis, fetchKPIs, isLoading, dateRange } = useData();
  const { t, translate } = useLanguage();

  useEffect(() => {
    fetchKPIs();
  }, [fetchKPIs, dateRange]);

  const { revenue = {}, marketing = {}, payments = {}, finance = {}, dateRange: kpiDateRange } = kpis || {};

  const marginValue =
    finance.margin != null && !Number.isNaN(finance.margin) ? finance.margin / 100 : null;

  const summaryCards = useMemo(
    () => [
      {
        title: translate('dashboard.summaryCards.financeRevenue'),
        value: finance.revenue ?? payments.totalRevenue ?? 0,
        change: null,
        type: 'currency',
        icon: FiDollarSign,
      },
      {
        title: translate('dashboard.summaryCards.financeProfit'),
        value: finance.profit ?? 0,
        change: null,
        type: 'currency',
        icon: FiTrendingUp,
      },
      {
        title: translate('dashboard.summaryCards.totalTransactions'),
        value: payments.totalTransactions ?? 0,
        change: null,
        type: 'number',
        icon: FiShoppingCart,
      },
      {
        title: translate('dashboard.summaryCards.profitMargin'),
        value: marginValue ?? 0,
        change: null,
        type: 'percentage',
        icon: FiPercent,
      },
    ],
    [
      finance.profit,
      finance.revenue,
      marginValue,
      payments.totalRevenue,
      payments.totalTransactions,
      translate,
    ]
  );

  const marginDisplay =
    finance.margin != null && !Number.isNaN(finance.margin)
      ? formatPercentage(finance.margin / 100)
      : formatPercentage(0);

  const detailSections = useMemo(
    () => [
      {
        title: translate('dashboard.sections.revenue.title'),
        items: [
          {
            label: translate('dashboard.sections.revenue.totalRevenue'),
            value: formatCurrency(revenue.total ?? 0),
          },
          {
            label: translate('dashboard.sections.revenue.orders'),
            value: (revenue.orders ?? 0).toLocaleString(),
          },
          {
            label: translate('dashboard.sections.revenue.avgOrderValue'),
            value: formatCurrency(revenue.avgOrderValue ?? 0),
          },
        ],
      },
      {
        title: translate('dashboard.sections.marketing.title'),
        items: [
          {
            label: translate('dashboard.sections.marketing.totalSpend'),
            value: formatCurrency(marketing.totalSpend ?? 0),
          },
          {
            label: translate('dashboard.sections.marketing.impressions'),
            value: (marketing.impressions ?? 0).toLocaleString(),
          },
          {
            label: translate('dashboard.sections.marketing.clicks'),
            value: (marketing.clicks ?? 0).toLocaleString(),
          },
          {
            label: translate('dashboard.sections.marketing.roas'),
            value: (marketing.roas ?? 0).toFixed(2),
          },
          {
            label: translate('dashboard.sections.marketing.cpc'),
            value: formatCurrency(marketing.cpc ?? 0),
          },
        ],
      },
      {
        title: translate('dashboard.sections.finance.title'),
        items: [
          {
            label: translate('dashboard.sections.finance.revenue'),
            value: formatCurrency(finance.revenue ?? 0),
          },
          {
            label: translate('dashboard.sections.finance.expenses'),
            value: formatCurrency(finance.expenses ?? 0),
          },
          {
            label: translate('dashboard.sections.finance.profit'),
            value: formatCurrency(finance.profit ?? 0),
          },
          {
            label: translate('dashboard.sections.finance.margin'),
            value: marginDisplay,
          },
        ],
      },
    ],
    [
      finance.expenses,
      finance.profit,
      finance.revenue,
      marginDisplay,
      marketing.clicks,
      marketing.cpc,
      marketing.impressions,
      marketing.roas,
      marketing.totalSpend,
      revenue.avgOrderValue,
      revenue.orders,
      revenue.total,
      translate,
    ]
  );

  if (isLoading && !kpis) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message={translate('dashboard.loading')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t.dashboard.title}</h1>
        <p className="mt-2 text-gray-600">{t.dashboard.subtitle}</p>
        {kpiDateRange && (
          <p className="mt-1 text-sm text-gray-500">
            {translate('dashboard.reportingPeriod', {
              start: new Date(kpiDateRange.startDate).toLocaleDateString(),
              end: new Date(kpiDateRange.endDate).toLocaleDateString(),
            })}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <MetricCard key={card.title} {...card} loading={isLoading} />
        ))}
      </div>

      <EioOverviewCard />

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
