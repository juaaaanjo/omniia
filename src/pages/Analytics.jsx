import CrossAnalysisDashboard from '../components/dashboard/CrossAnalysisDashboard';
import { useLanguage } from '../hooks/useLanguage';

const Analytics = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t.analytics.page.title}</h1>
        <p className="mt-2 text-gray-600">{t.analytics.page.subtitle}</p>
      </div>

      <CrossAnalysisDashboard />
    </div>
  );
};

export default Analytics;
