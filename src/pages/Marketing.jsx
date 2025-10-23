import MarketingDashboard from '../components/dashboard/MarketingDashboard';

const Marketing = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Marketing</h1>
        <p className="mt-2 text-gray-600">
          Comprehensive view of your marketing campaigns and performance
        </p>
      </div>

      <MarketingDashboard />
    </div>
  );
};

export default Marketing;
