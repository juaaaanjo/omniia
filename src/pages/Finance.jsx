import FinanceDashboard from '../components/dashboard/FinanceDashboard';
import { useLanguage } from '../hooks/useLanguage';

const Finance = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t.finance.page.title}</h1>
        <p className="mt-2 text-gray-600">{t.finance.page.subtitle}</p>
      </div>

      <FinanceDashboard />
    </div>
  );
};

export default Finance;
