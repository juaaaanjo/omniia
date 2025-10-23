import { useEffect } from 'react';
import { useData } from '../../hooks/useData';
import KPICards from './KPICards';
import LineChart from '../charts/LineChart';
import BarChart from '../charts/BarChart';
import PieChart from '../charts/PieChart';
import LoadingSpinner from '../common/LoadingSpinner';
import { CHART_COLORS } from '../../utils/constants';

const SalesDashboard = () => {
  const { salesData, fetchSalesData, isLoading, dateRange } = useData();

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData, dateRange]);

  if (isLoading && !salesData) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message="Loading sales data..." />
      </div>
    );
  }

  if (!salesData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No sales data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <KPICards data={salesData.kpis} area="sales" loading={isLoading} />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales over time */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sales Over Time
          </h3>
          <LineChart
            data={salesData.salesOverTime || []}
            lines={[
              { dataKey: 'sales', stroke: CHART_COLORS.success, name: 'Sales' },
              { dataKey: 'orders', stroke: CHART_COLORS.primary, name: 'Orders' },
            ]}
            xAxisKey="date"
            height={300}
          />
        </div>

        {/* Sales by product */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Products by Sales
          </h3>
          <BarChart
            data={salesData.topProducts || []}
            bars={[
              { dataKey: 'sales', fill: CHART_COLORS.success, name: 'Sales' },
            ]}
            xAxisKey="product"
            height={300}
          />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by channel */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sales by Channel
          </h3>
          <PieChart
            data={salesData.salesByChannel || []}
            nameKey="channel"
            dataKey="sales"
            height={300}
          />
        </div>

        {/* Conversion funnel */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Conversion Funnel
          </h3>
          <div className="space-y-3">
            {salesData.conversionFunnel?.map((stage, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{stage.name}</span>
                  <span className="text-gray-600">
                    {stage.count.toLocaleString()} ({stage.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top customers table */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Customers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  AOV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  LTV
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.topCustomers?.map((customer, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {customer.name}
                    </div>
                    <div className="text-sm text-gray-500">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${customer.aov.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${customer.ltv.toLocaleString()}
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

export default SalesDashboard;
