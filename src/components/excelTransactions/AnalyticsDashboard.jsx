import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { FiDollarSign, FiTrendingUp, FiCreditCard, FiMapPin, FiPercent, FiRefreshCw } from 'react-icons/fi';
import { useExcelTransactions } from '../../hooks/useExcelTransactions';
import { useLanguage } from '../../hooks/useLanguage';

const AnalyticsDashboard = () => {
  const { translate } = useLanguage();
  const {
    revenue,
    dailyRevenue,
    paymentMethods,
    topCustomers,
    revenueByLocation,
    taxes,
    isLoading,
    fetchAllAnalytics,
    dateRange
  } = useExcelTransactions();

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Initialize date range (last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    setSelectedDateRange({
      startDate: formatDate(thirtyDaysAgo),
      endDate: formatDate(today)
    });
  }, []);

  // Fetch analytics when date range changes
  useEffect(() => {
    if (selectedDateRange.startDate && selectedDateRange.endDate) {
      fetchAllAnalytics(selectedDateRange.startDate, selectedDateRange.endDate);
    }
  }, [selectedDateRange, fetchAllAnalytics]);

  // Handle date range change
  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setSelectedDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle refresh
  const handleRefresh = () => {
    if (selectedDateRange.startDate && selectedDateRange.endDate) {
      fetchAllAnalytics(selectedDateRange.startDate, selectedDateRange.endDate);
    }
  };

  // Format currency (Colombian Pesos)
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  // Format number
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num || 0);
  };

  // Colors for charts
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="card p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-1">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {translate('excelTransactions.analytics.dateRange.startDate')}
              </label>
              <input
                type="date"
                name="startDate"
                value={selectedDateRange.startDate}
                onChange={handleDateRangeChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {translate('excelTransactions.analytics.dateRange.endDate')}
              </label>
              <input
                type="date"
                name="endDate"
                value={selectedDateRange.endDate}
                onChange={handleDateRangeChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {translate('excelTransactions.analytics.dateRange.refresh')}
          </button>
        </div>
      </div>

      {/* Revenue Summary Cards */}
      {revenue && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiDollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">{translate('excelTransactions.analytics.revenue.totalRevenue')}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenue.totalRevenue)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatNumber(revenue.totalTransactions)} {translate('excelTransactions.analytics.revenue.transactions')}
            </p>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">{translate('excelTransactions.analytics.revenue.avgTicket')}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenue.avgTicket)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {translate('excelTransactions.analytics.revenue.perTransaction')}
            </p>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiCreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">{translate('excelTransactions.analytics.revenue.cardPayments')}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenue.totalCard)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {((revenue.totalCard / revenue.totalRevenue) * 100).toFixed(1)}% {translate('excelTransactions.analytics.revenue.ofTotal')}
            </p>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiDollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">{translate('excelTransactions.analytics.revenue.cashPayments')}</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenue.totalCash)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {((revenue.totalCash / revenue.totalRevenue) * 100).toFixed(1)}% {translate('excelTransactions.analytics.revenue.ofTotal')}
            </p>
          </div>
        </div>
      )}

      {/* Daily Revenue Chart */}
      {dailyRevenue && dailyRevenue.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{translate('excelTransactions.analytics.charts.dailyRevenue')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Revenue"
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Chart */}
        {paymentMethods && (
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{translate('excelTransactions.analytics.charts.paymentMethods')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: translate('excelTransactions.analytics.paymentMethods.cash'), value: paymentMethods.totalCash, count: paymentMethods.cashTransactions },
                    { name: translate('excelTransactions.analytics.paymentMethods.card'), value: paymentMethods.totalCard, count: paymentMethods.cardTransactions }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[0, 1].map((index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <p className="text-gray-600">{translate('excelTransactions.analytics.paymentMethods.cashTransactions')}</p>
                <p className="font-medium text-gray-900">{formatNumber(paymentMethods.cashTransactions)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">{translate('excelTransactions.analytics.paymentMethods.cardTransactions')}</p>
                <p className="font-medium text-gray-900">{formatNumber(paymentMethods.cardTransactions)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tax Summary */}
        {taxes && (
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{translate('excelTransactions.analytics.taxes.title')}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiPercent className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{translate('excelTransactions.analytics.taxes.totalIVA')}</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(taxes.totalIVA)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiPercent className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{translate('excelTransactions.analytics.taxes.totalICO')}</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(taxes.totalICO)}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FiDollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{translate('excelTransactions.analytics.taxes.totalTax')}</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(taxes.totalTax)}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {translate('excelTransactions.analytics.taxes.basedOn').replace('{count}', formatNumber(taxes.transactionCount))}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Revenue by Location Chart */}
      {revenueByLocation && revenueByLocation.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{translate('excelTransactions.analytics.charts.revenueByLocation')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByLocation}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="totalRevenue" fill="#3b82f6" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Customers Table */}
      {topCustomers && topCustomers.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{translate('excelTransactions.analytics.charts.topCustomers')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">{translate('excelTransactions.analytics.table.customer')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">{translate('excelTransactions.analytics.table.contact')}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">{translate('excelTransactions.analytics.table.revenue')}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">{translate('excelTransactions.analytics.table.transactions')}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">{translate('excelTransactions.analytics.table.avgTicket')}</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => (
                  <tr key={customer.customerId || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {customer.customerName || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div>{customer.customerEmail || '-'}</div>
                      <div className="text-xs">{customer.customerPhone || '-'}</div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                      {formatCurrency(customer.totalRevenue)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      {formatNumber(customer.transactionCount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      {formatCurrency(customer.avgTicket)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-900">{translate('excelTransactions.analytics.loading')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
