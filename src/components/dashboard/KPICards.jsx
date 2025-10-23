import MetricCard from '../charts/MetricCard';
import { FiTrendingUp, FiDollarSign, FiShoppingCart, FiTarget } from 'react-icons/fi';

const KPICards = ({ data, area, loading = false }) => {
  const getKPIs = () => {
    if (!data) return [];

    switch (area) {
      case 'marketing':
        return [
          {
            title: 'Total Spend',
            value: data.totalSpend,
            change: data.spendChange,
            type: 'currency',
            icon: FiDollarSign,
          },
          {
            title: 'ROAS',
            value: data.roas,
            change: data.roasChange,
            type: 'number',
            icon: FiTrendingUp,
          },
          {
            title: 'Average CPC',
            value: data.avgCpc,
            change: data.cpcChange,
            type: 'currency',
            icon: FiTarget,
          },
          {
            title: 'CTR',
            value: data.ctr,
            change: data.ctrChange,
            type: 'percentage',
            icon: FiTarget,
          },
        ];

      case 'sales':
        return [
          {
            title: 'Total Sales',
            value: data.totalSales,
            change: data.salesChange,
            type: 'currency',
            icon: FiDollarSign,
          },
          {
            title: 'Total Orders',
            value: data.totalOrders,
            change: data.ordersChange,
            type: 'number',
            icon: FiShoppingCart,
          },
          {
            title: 'Average Order Value',
            value: data.avgOrderValue,
            change: data.aovChange,
            type: 'currency',
            icon: FiTrendingUp,
          },
          {
            title: 'Conversion Rate',
            value: data.conversionRate,
            change: data.conversionChange,
            type: 'percentage',
            icon: FiTarget,
          },
        ];

      case 'finance':
        return [
          {
            title: 'Revenue',
            value: data.revenue,
            change: data.revenueChange,
            type: 'currency',
            icon: FiDollarSign,
          },
          {
            title: 'Total Costs',
            value: data.totalCosts,
            change: data.costsChange,
            type: 'currency',
            icon: FiDollarSign,
          },
          {
            title: 'Profit Margin',
            value: data.profitMargin,
            change: data.marginChange,
            type: 'percentage',
            icon: FiTrendingUp,
          },
          {
            title: 'Cash Flow',
            value: data.cashFlow,
            change: data.cashFlowChange,
            type: 'currency',
            icon: FiDollarSign,
          },
        ];

      default:
        return [];
    }
  };

  const kpis = getKPIs();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <MetricCard key={index} {...kpi} loading={loading} />
      ))}
    </div>
  );
};

export default KPICards;
