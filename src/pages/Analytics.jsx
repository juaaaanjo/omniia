import CrossAnalysisDashboard from '../components/dashboard/CrossAnalysisDashboard';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cross-Channel Analytics</h1>
        <p className="mt-2 text-gray-600">
          Deep dive into cross-channel attribution, ROI, and customer lifetime value
        </p>
      </div>

      <CrossAnalysisDashboard />
    </div>
  );
};

export default Analytics;
