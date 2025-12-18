import MarketingDashboard from '../components/dashboard/MarketingDashboard';
import CampaignManagement from '../components/campaigns/CampaignManagement';
import GuardrailsDashboard from '../components/guardrails/GuardrailsDashboard';
import DataSourceSelector from '../components/common/DataSourceSelector';
import { useDataSource } from '../hooks/useDataSource';

const Marketing = () => {
  const { selectedDataSource, changeDataSource } = useDataSource();

  return (
    <div className="space-y-section">
      {/* Data Source Selector */}
      <div className="flex justify-end">
        <DataSourceSelector
          value={selectedDataSource}
          onChange={changeDataSource}
        />
      </div>

      <section className="space-y-8">
        <MarketingDashboard />
        <CampaignManagement />
        <GuardrailsDashboard />
      </section>
    </div>
  );
};

export default Marketing;
