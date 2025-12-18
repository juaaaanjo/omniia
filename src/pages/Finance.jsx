import FinanceDashboard from '../components/dashboard/FinanceDashboard';
import DataSourceSelector from '../components/common/DataSourceSelector';
import { useDataSource } from '../hooks/useDataSource';

const Finance = () => {
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

      <FinanceDashboard />
    </div>
  );
};

export default Finance;
