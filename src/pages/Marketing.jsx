import MarketingDashboard from '../components/dashboard/MarketingDashboard';
import CampaignManagement from '../components/campaigns/CampaignManagement';
import GuardrailsDashboard from '../components/guardrails/GuardrailsDashboard';

const Marketing = () => {
  return (
    <div className="space-y-section">
      <section className="space-y-8">
        <MarketingDashboard />
        <CampaignManagement />
        <GuardrailsDashboard />
      </section>
    </div>
  );
};

export default Marketing;
