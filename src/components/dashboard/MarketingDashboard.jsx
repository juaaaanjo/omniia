import { useEffect, useMemo } from 'react';
import { useData } from '../../hooks/useData';
import { useLanguage } from '../../hooks/useLanguage';
import SectionHeader from '../common/SectionHeader';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';
import LoadingSpinner from '../common/LoadingSpinner';
import { CHART_COLORS } from '../../utils/constants';
import { formatCurrency, formatDate, formatNumber } from '../../utils/formatters';

const REPORTING_CURRENCY = 'COP';

const MarketingDashboard = () => {
  const { marketingData, fetchMarketingData, isLoading, dateRange } = useData();
  const { t, translate } = useLanguage();

  useEffect(() => {
    fetchMarketingData();
  }, [fetchMarketingData, dateRange]);

  const payload = marketingData?.data ?? marketingData ?? null;
  const campaigns = payload?.campaigns ?? [];
  const dailySpend = payload?.dailySpend ?? [];
  const summary = payload?.summary ?? {};
  const responseDateRange = payload?.dateRange;
  const hasPayload = Boolean(payload);

  const topPerformer = summary?.topPerformer;

  const totals = useMemo(() => {
    if (!Array.isArray(campaigns) || campaigns.length === 0) {
      return {
        spend: 0,
        impressions: 0,
        clicks: 0,
        revenue: 0,
        orders: 0,
        avgCpc: 0,
      };
    }

    const aggregate = campaigns.reduce(
      (acc, campaign) => {
        acc.spend += campaign?.totalSpend ?? 0;
        acc.impressions += campaign?.totalImpressions ?? 0;
        acc.clicks += campaign?.totalClicks ?? 0;
        acc.revenue += campaign?.totalRevenue ?? 0;
        acc.orders += campaign?.totalOrders ?? 0;
        return acc;
      },
      { spend: 0, impressions: 0, clicks: 0, revenue: 0, orders: 0 },
    );

    return {
      ...aggregate,
      avgCpc: aggregate.clicks > 0 ? aggregate.spend / aggregate.clicks : 0,
    };
  }, [campaigns]);

  const formattedRange = useMemo(() => {
    if (!responseDateRange?.startDate || !responseDateRange?.endDate) {
      return null;
    }

    return `${formatDate(responseDateRange.startDate, 'MMM dd, yyyy')} \u2013 ${formatDate(
      responseDateRange.endDate,
      'MMM dd, yyyy',
    )}`;
  }, [responseDateRange]);

  const summaryCards = [
    {
      label: t.marketing.dashboard.summary.totalCampaigns,
      value: formatNumber(summary?.totalCampaigns ?? campaigns.length ?? 0, 0),
      helper: t.marketing.dashboard.summary.totalCampaignsHelper,
    },
    {
      label: t.marketing.dashboard.summary.totalSpend,
      value: formatCurrency(totals.spend, REPORTING_CURRENCY),
      helper: translate('marketing.dashboard.summary.totalSpendHelper', {
        value: formatCurrency(totals.avgCpc, REPORTING_CURRENCY),
      }),
    },
    {
      label: t.marketing.dashboard.summary.impressions,
      value: formatNumber(totals.impressions, 1),
      helper: translate('marketing.dashboard.summary.impressionsHelper', {
        value: formatNumber(totals.clicks, 1),
      }),
    },
    {
      label: t.marketing.dashboard.summary.avgRoas,
      value: `${Number(summary?.avgROAS ?? 0).toFixed(2)}x`,
      helper: translate('marketing.dashboard.summary.avgRoasHelper', {
        value: formatCurrency(totals.revenue, REPORTING_CURRENCY),
      }),
    },
  ];

  const dailyPerformance = useMemo(() => {
    if (!Array.isArray(dailySpend)) return [];

    return dailySpend.map((entry) => ({
      date: formatDate(entry?._id, 'MMM dd'),
      spend: entry?.spend ?? 0,
      impressions: entry?.impressions ?? 0,
      clicks: entry?.clicks ?? 0,
    }));
  }, [dailySpend]);

  const topCampaigns = useMemo(() => {
    if (!Array.isArray(campaigns) || campaigns.length === 0) return [];

    return [...campaigns]
      .sort((a, b) => (b?.totalSpend ?? 0) - (a?.totalSpend ?? 0))
      .slice(0, 10);
  }, [campaigns]);

  const campaignChartData = useMemo(
    () =>
      topCampaigns.slice(0, 7).map((campaign) => ({
        campaign: campaign?.campaignName ?? 'Unnamed campaign',
        spend: campaign?.totalSpend ?? 0,
      })),
    [topCampaigns],
  );

  if (isLoading && !marketingData) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message="Loading marketing data..." />
      </div>
    );
  }

  if (!hasPayload) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No marketing data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title={t.marketing.dashboard.title}
        subtitle={formattedRange || t.marketing.dashboard.subtitle}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="card card-hover p-5"
          >
            <p className="text-sm font-normal text-gray-500">{card.label}</p>
            <p className="mt-3 text-xl font-medium text-gray-900">{card.value}</p>
            {card.helper && <p className="mt-2 text-xs text-gray-400">{card.helper}</p>}
          </div>
        ))}
      </div>

      {/* Top performer */}
      {topPerformer && (
        <div className="card p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-900">
                {t.marketing.dashboard.topPerformer.title}
              </h3>
              <p className="text-sm font-normal text-gray-500">
                {t.marketing.dashboard.topPerformer.subtitle}
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-600">
              {translate('marketing.dashboard.topPerformer.spendPill', {
                value: formatCurrency(topPerformer?.totalSpend ?? 0, REPORTING_CURRENCY),
              })}
            </span>
          </div>
          <h4 className="mt-4 text-lg font-medium text-gray-900">
            {topPerformer?.campaignName ?? 'Unnamed campaign'}
          </h4>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-sm font-normal text-gray-500">{t.kpi.impressions}</dt>
              <dd className="text-lg font-medium text-gray-900">
                {formatNumber(topPerformer?.totalImpressions ?? 0, 1)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-normal text-gray-500">{t.kpi.clicks}</dt>
              <dd className="text-lg font-medium text-gray-900">
                {formatNumber(topPerformer?.totalClicks ?? 0, 1)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-normal text-gray-500">
                {t.marketing.dashboard.topPerformer.avgCpc}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {formatCurrency(topPerformer?.avgCPC ?? 0, REPORTING_CURRENCY)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-normal text-gray-500">{t.kpi.roas}</dt>
              <dd className="text-lg font-medium text-gray-900">
                {Number(topPerformer?.roas ?? 0).toFixed(2)}x
              </dd>
            </div>
          </dl>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-900">
                {t.marketing.dashboard.dailyPerformance.title}
              </h3>
              <p className="text-sm font-normal text-gray-500">
                {t.marketing.dashboard.dailyPerformance.subtitle}
              </p>
            </div>
            {isLoading && (
              <span className="text-xs font-medium text-primary-600">
                {t.marketing.dashboard.dailyPerformance.refreshing}
              </span>
            )}
          </div>
          <LineChart
            data={dailyPerformance}
            lines={[
              { dataKey: 'spend', stroke: CHART_COLORS.primary, name: 'Spend' },
              { dataKey: 'clicks', stroke: CHART_COLORS.secondary, name: 'Clicks' },
              { dataKey: 'impressions', stroke: CHART_COLORS.info, name: 'Impressions' },
            ]}
            xAxisKey="date"
            height={320}
          />
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-900">
                {t.marketing.dashboard.topCampaigns.title}
              </h3>
              <p className="text-sm font-normal text-gray-500">
                {t.marketing.dashboard.topCampaigns.subtitle}
              </p>
            </div>
            <span className="text-xs text-gray-400">
              {translate('marketing.dashboard.topCampaigns.showing', {
                visible: campaignChartData.length,
                total: campaigns.length,
              })}
            </span>
          </div>
          <BarChart
            data={campaignChartData}
            bars={[
              { dataKey: 'spend', fill: CHART_COLORS.primary, name: 'Spend' },
            ]}
            xAxisKey="campaign"
            height={320}
            layout="horizontal"
          />
        </div>
      </div>

      <div className="card p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-medium text-gray-900">
              {t.marketing.dashboard.table.title}
            </h3>
            <p className="text-sm font-normal text-gray-500">
              {t.marketing.dashboard.table.subtitle}
            </p>
          </div>
          <span className="text-sm text-gray-400">
            {translate('marketing.dashboard.table.showing', {
              count: topCampaigns.length,
            })}
          </span>
        </div>

        {topCampaigns.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            {t.marketing.dashboard.table.noData}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left font-medium text-gray-500">
                    {t.marketing.dashboard.table.headers.campaign}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium text-gray-500">
                    {t.marketing.dashboard.table.headers.spend}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium text-gray-500">
                    {t.kpi.impressions}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium text-gray-500">
                    {t.kpi.clicks}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium text-gray-500">
                    {t.marketing.dashboard.table.headers.avgCpc}
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium text-gray-500">
                    {t.kpi.roas}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {topCampaigns.map((campaign) => (
                  <tr key={campaign?._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                      {campaign?.campaignName ?? 'Unnamed campaign'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">
                      {formatCurrency(campaign?.totalSpend ?? 0, REPORTING_CURRENCY)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">
                      {formatNumber(campaign?.totalImpressions ?? 0, 1)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">
                      {formatNumber(campaign?.totalClicks ?? 0, 1)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">
                      {formatCurrency(campaign?.avgCPC ?? 0, REPORTING_CURRENCY)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">
                      {Number(campaign?.roas ?? 0).toFixed(2)}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingDashboard;
