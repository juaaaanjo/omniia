import { useEffect } from 'react';
import { useData } from '../../hooks/useData';
import BarChart from '../charts/BarChart';
import LoadingSpinner from '../common/LoadingSpinner';
import { CHART_COLORS } from '../../utils/constants';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { useLanguage } from '../../hooks/useLanguage';

const CrossAnalysisDashboard = () => {
  const { crossAnalysisData, fetchCrossAnalysisData, isLoading, dateRange } = useData();
  const { t, translate } = useLanguage();

  useEffect(() => {
    fetchCrossAnalysisData();
  }, [fetchCrossAnalysisData, dateRange]);

  if (isLoading && !crossAnalysisData) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message={t.analytics.dashboard.loading} />
      </div>
    );
  }

  if (!crossAnalysisData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t.analytics.dashboard.empty}</p>
      </div>
    );
  }

  const { revenueVsSpend, campaignPerformance, customerLifetimeValue } = crossAnalysisData;

  // Prepare chart data for top campaigns
  const topCampaignsData = campaignPerformance?.campaigns?.slice(0, 10).map(campaign => ({
    name: campaign.campaignName?.substring(0, 30) + (campaign.campaignName?.length > 30 ? '...' : ''),
    spend: campaign.totalSpend || 0,
    revenue: campaign.totalRevenue || 0,
    clicks: campaign.totalClicks || 0,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Spend */}
        <div className="card card-hover p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-normal text-gray-500">
                {t.analytics.dashboard.summary.totalSpend}
              </p>
              <p className="mt-2 text-xl font-medium text-gray-900 leading-tight">
                {formatCurrency(revenueVsSpend?.totalSpend || 0)}
              </p>
            </div>
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {translate('analytics.dashboard.summary.totalSpendHelper', {
              value: formatNumber(revenueVsSpend?.impressions || 0),
            })}
          </p>
        </div>

        {/* Total Revenue */}
        <div className="card card-hover p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-normal text-gray-500">
                {t.analytics.dashboard.summary.totalRevenue}
              </p>
              <p className="mt-2 text-xl font-medium text-gray-900 leading-tight">
                {formatCurrency(revenueVsSpend?.totalRevenue || 0)}
              </p>
            </div>
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {translate('analytics.dashboard.summary.totalRevenueHelper', {
              value: formatNumber(revenueVsSpend?.orderCount || 0),
            })}
          </p>
        </div>

        {/* ROAS */}
        <div className="card card-hover p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-normal text-gray-500">
                {t.analytics.dashboard.summary.roas}
              </p>
              <p className="mt-2 text-xl font-medium text-gray-900 leading-tight">
                {(revenueVsSpend?.roas || 0).toFixed(2)}x
              </p>
            </div>
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {translate('analytics.dashboard.summary.roasHelper', {
              value: formatCurrency(
                (revenueVsSpend?.totalSpend || 0) / (revenueVsSpend?.clicks || 1),
              ),
            })}
          </p>
        </div>

        {/* Net Profit */}
        <div className="card card-hover p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-normal text-gray-500">
                {t.analytics.dashboard.summary.netProfit}
              </p>
              <p className={`mt-2 text-xl font-medium leading-tight ${(revenueVsSpend?.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(revenueVsSpend?.netProfit || 0)}
              </p>
            </div>
            <div className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-lg ${(revenueVsSpend?.netProfit || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <svg className={`w-5 h-5 ${(revenueVsSpend?.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {translate('analytics.dashboard.summary.netProfitHelper', {
              value: formatNumber(revenueVsSpend?.clicks || 0),
            })}
          </p>
        </div>
      </div>

      {/* Best Performing Campaign */}
      {campaignPerformance?.bestPerformer && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-base font-medium text-gray-900 mb-2">
                {t.analytics.dashboard.bestPerformer.title}
              </h3>
              <p className="text-2xl font-medium text-blue-600 mb-4">
                {campaignPerformance.bestPerformer.campaignName}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-normal text-gray-600">
                    {t.analytics.dashboard.bestPerformer.metrics.totalSpend}
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {formatCurrency(campaignPerformance.bestPerformer.totalSpend || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-normal text-gray-600">
                    {t.analytics.dashboard.bestPerformer.metrics.impressions}
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {formatNumber(campaignPerformance.bestPerformer.totalImpressions || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-normal text-gray-600">
                    {t.analytics.dashboard.bestPerformer.metrics.clicks}
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {formatNumber(campaignPerformance.bestPerformer.totalClicks || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-normal text-gray-600">
                    {t.analytics.dashboard.bestPerformer.metrics.avgCpc}
                  </p>
                  <p className="text-lg font-medium text-gray-900">
                    {formatCurrency(campaignPerformance.bestPerformer.avgCPC || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Performance Chart */}
      <div className="card p-6">
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900">
            {t.analytics.dashboard.topCampaigns.title}
          </h3>
          <p className="text-sm font-normal text-gray-500 mt-1">
            {translate('analytics.dashboard.topCampaigns.totalCampaigns', {
              count: campaignPerformance?.totalCampaigns || 0,
            })}
          </p>
        </div>
        {topCampaignsData.length > 0 ? (
          <BarChart
            data={topCampaignsData}
            bars={[
              {
                dataKey: 'spend',
                fill: CHART_COLORS.primary,
                name: t.analytics.dashboard.topCampaigns.chart.spend,
              },
              {
                dataKey: 'revenue',
                fill: CHART_COLORS.success,
                name: t.analytics.dashboard.topCampaigns.chart.revenue,
              },
            ]}
            xAxisKey="name"
            height={400}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {t.analytics.dashboard.topCampaigns.noData}
            </p>
          </div>
        )}
      </div>

      {/* Customer Lifetime Value */}
      <div className="card p-6">
        <h3 className="text-base font-medium text-gray-900 mb-6">
          {t.analytics.dashboard.clv.title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-sm font-normal text-gray-500 mb-2">
              {t.analytics.dashboard.clv.totalCustomers}
            </p>
            <p className="text-3xl font-medium text-gray-900">
              {formatNumber(customerLifetimeValue?.totalCustomers || 0)}
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-sm font-normal text-gray-500 mb-2">
              {t.analytics.dashboard.clv.avgLifetimeValue}
            </p>
            <p className="text-3xl font-medium text-gray-900">
              {formatCurrency(customerLifetimeValue?.avgLifetimeValue || 0)}
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-sm font-normal text-gray-500 mb-2">
              {t.analytics.dashboard.clv.avgTransactionCount}
            </p>
            <p className="text-3xl font-medium text-gray-900">
              {(customerLifetimeValue?.avgTransactionCount || 0).toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* All Campaigns Table */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-900">
            {t.analytics.dashboard.table.title}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.analytics.dashboard.table.headers.campaign}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.analytics.dashboard.table.headers.spend}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.analytics.dashboard.table.headers.revenue}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.analytics.dashboard.table.headers.impressions}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.analytics.dashboard.table.headers.clicks}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.analytics.dashboard.table.headers.avgCpc}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.analytics.dashboard.table.headers.roas}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaignPerformance?.campaigns?.map((campaign, idx) => (
                <tr key={campaign._id || idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {campaign.campaignName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(campaign.totalSpend || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(campaign.totalRevenue || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(campaign.totalImpressions || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(campaign.totalClicks || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(campaign.avgCPC || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${(campaign.roas || 0) > 1 ? 'text-green-600' : 'text-red-600'}`}>
                      {(campaign.roas || 0).toFixed(2)}x
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CrossAnalysisDashboard;
