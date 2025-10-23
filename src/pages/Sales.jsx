import SalesDashboard from '../components/dashboard/SalesDashboard';

const Sales = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
        <p className="mt-2 text-gray-600">
          Track your sales performance, orders, and customer metrics
        </p>
      </div>

      <SalesDashboard />
    </div>
  );
};

export default Sales;
