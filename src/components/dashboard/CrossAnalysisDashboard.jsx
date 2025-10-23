import { useEffect } from 'react';
import { useData } from '../../hooks/useData';
import BarChart from '../charts/BarChart';
import LoadingSpinner from '../common/LoadingSpinner';
import { CHART_COLORS } from '../../utils/constants';
import { formatCurrency, formatNumber } from '../../utils/formatters';

const CrossAnalysisDashboard = () => {
  const { crossAnalysisData, fetchCrossAnalysisData, isLoading, dateRange } = useData();

  useEffect(() => {
    fetchCrossAnalysisData();
  }, [fetchCrossAnalysisData, dateRange]);

  if (isLoading && !crossAnalysisData) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message="Loading cross-analysis data..." />
      </div>
    );
  }

  if (!crossAnalysisData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No cross-analysis data available</p>
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
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spend</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatCurrency(revenueVsSpend?.totalSpend || 0)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {formatNumber(revenueVsSpend?.impressions || 0)} impressions
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatCurrency(revenueVsSpend?.totalRevenue || 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {formatNumber(revenueVsSpend?.orderCount || 0)} orders
          </p>
        </div>

        {/* ROAS */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ROAS</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {(revenueVsSpend?.roas || 0).toFixed(2)}x
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Avg CPC: {formatCurrency((revenueVsSpend?.totalSpend || 0) / (revenueVsSpend?.clicks || 1))}
          </p>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className={`mt-2 text-3xl font-bold ${(revenueVsSpend?.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(revenueVsSpend?.netProfit || 0)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${(revenueVsSpend?.netProfit || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              <svg className={`w-6 h-6 ${(revenueVsSpend?.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {formatNumber(revenueVsSpend?.clicks || 0)} clicks
          </p>
        </div>
      </div>

      {/* Best Performing Campaign */}
      {campaignPerformance?.bestPerformer && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Top Performing Campaign
              </h3>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                {campaignPerformance.bestPerformer.campaignName}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Spend</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(campaignPerformance.bestPerformer.totalSpend || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Impressions</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatNumber(campaignPerformance.bestPerformer.totalImpressions || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Clicks</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatNumber(campaignPerformance.bestPerformer.totalClicks || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg CPC</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(campaignPerformance.bestPerformer.avgCPC || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Performance Chart */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top 10 Campaigns by Spend</h3>
          <p className="text-sm text-gray-600 mt-1">
            Total campaigns: {campaignPerformance?.totalCampaigns || 0}
          </p>
        </div>
        {topCampaignsData.length > 0 ? (
          <BarChart
            data={topCampaignsData}
            bars={[
              { dataKey: 'spend', fill: CHART_COLORS.primary, name: 'Spend' },
              { dataKey: 'revenue', fill: CHART_COLORS.success, name: 'Revenue' },
            ]}
            xAxisKey="name"
            height={400}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No campaign data available</p>
          </div>
        )}
      </div>

      {/* Customer Lifetime Value */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Customer Lifetime Value Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Total Customers</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatNumber(customerLifetimeValue?.totalCustomers || 0)}
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Avg Lifetime Value</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(customerLifetimeValue?.avgLifetimeValue || 0)}
            </p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Avg Transaction Count</p>
            <p className="text-3xl font-bold text-gray-900">
              {(customerLifetimeValue?.avgTransactionCount || 0).toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      {/* All Campaigns Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            All Campaigns Performance
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impressions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg CPC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ROAS
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
