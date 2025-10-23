import { useEffect } from 'react';
import { useData } from '../../hooks/useData';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';
import LoadingSpinner from '../common/LoadingSpinner';
import { CHART_COLORS } from '../../utils/constants';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cross-Channel Analysis</h2>
        <p className="text-gray-600">
          Comprehensive view of performance across marketing, sales, and finance
        </p>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI by Channel */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ROI by Channel
          </h3>
          <BarChart
            data={crossAnalysisData.roiByChannel || []}
            bars={[
              { dataKey: 'roi', fill: CHART_COLORS.primary, name: 'ROI' },
            ]}
            xAxisKey="channel"
            height={300}
          />
        </div>

        {/* Customer Acquisition Cost */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Customer Acquisition Cost (CAC)
          </h3>
          <LineChart
            data={crossAnalysisData.cacTrend || []}
            lines={[
              { dataKey: 'cac', stroke: CHART_COLORS.warning, name: 'CAC' },
              { dataKey: 'target', stroke: CHART_COLORS.info, name: 'Target' },
            ]}
            xAxisKey="date"
            height={300}
          />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Lifetime Value */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Customer Lifetime Value (LTV)
          </h3>
          <BarChart
            data={crossAnalysisData.ltvBySegment || []}
            bars={[
              { dataKey: 'ltv', fill: CHART_COLORS.success, name: 'LTV' },
            ]}
            xAxisKey="segment"
            height={300}
          />
        </div>

        {/* LTV:CAC Ratio */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            LTV:CAC Ratio by Channel
          </h3>
          <BarChart
            data={crossAnalysisData.ltvCacRatio || []}
            bars={[
              { dataKey: 'ratio', fill: CHART_COLORS.secondary, name: 'LTV:CAC Ratio' },
            ]}
            xAxisKey="channel"
            height={300}
          />
        </div>
      </div>

      {/* Attribution table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Multi-Touch Attribution Analysis
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Channel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Spend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  CAC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ROI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ROAS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {crossAnalysisData.attribution?.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {row.channel}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${row.spend.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${row.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.orders.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${row.cac.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        row.roi > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {row.roi.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.roas.toFixed(2)}x
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cohort Analysis */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cohort Retention Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Cohort
                </th>
                <th className="px-4 py-2 text-center font-medium text-gray-700">
                  Month 0
                </th>
                <th className="px-4 py-2 text-center font-medium text-gray-700">
                  Month 1
                </th>
                <th className="px-4 py-2 text-center font-medium text-gray-700">
                  Month 2
                </th>
                <th className="px-4 py-2 text-center font-medium text-gray-700">
                  Month 3
                </th>
                <th className="px-4 py-2 text-center font-medium text-gray-700">
                  Month 4
                </th>
                <th className="px-4 py-2 text-center font-medium text-gray-700">
                  Month 5
                </th>
              </tr>
            </thead>
            <tbody>
              {crossAnalysisData.cohortAnalysis?.map((cohort, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {cohort.cohort}
                  </td>
                  {cohort.retention.map((rate, i) => (
                    <td
                      key={i}
                      className="px-4 py-2 text-center"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${rate / 100})`,
                        color: rate > 50 ? 'white' : 'inherit',
                      }}
                    >
                      {rate}%
                    </td>
                  ))}
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
