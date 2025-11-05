import MarketingDashboard from '../components/dashboard/MarketingDashboard';
import CampaignManagement from '../components/campaigns/CampaignManagement';
import GuardrailsDashboard from '../components/guardrails/GuardrailsDashboard';
import { useLanguage } from '../hooks/useLanguage';

const Marketing = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t.marketing.page.title}</h1>
        <p className="mt-2 text-gray-600">{t.marketing.page.subtitle}</p>
      </div>

      <section className="space-y-10">
        <MarketingDashboard />
        <CampaignManagement />
        <GuardrailsDashboard />
      </section>
    </div>
  );
};

export default Marketing;
