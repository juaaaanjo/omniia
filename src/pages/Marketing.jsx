import MarketingDashboard from '../components/dashboard/MarketingDashboard';
import CampaignManagement from '../components/campaigns/CampaignManagement';
import GuardrailsDashboard from '../components/guardrails/GuardrailsDashboard';

const Marketing = () => {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Marketing</h1>
        <p className="mt-2 text-gray-600">
          Comprehensive view of your marketing campaigns and performance
        </p>
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
