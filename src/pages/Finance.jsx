import FinanceDashboard from '../components/dashboard/FinanceDashboard';

const Finance = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Finance</h1>
        <p className="mt-2 text-gray-600">
          Monitor your financial health, revenue, costs, and profitability
        </p>
      </div>

      <FinanceDashboard />
    </div>
  );
};

export default Finance;
