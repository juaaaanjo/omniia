import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

const BarChart = ({
  data = [],
  bars = [],
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = true,
  layout = 'vertical',
}) => {
  // Default bar if none provided
  const defaultBars = bars.length > 0 ? bars : [
    { dataKey: 'value', fill: CHART_COLORS.primary, name: 'Value' }
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        {layout === 'horizontal' ? (
          <>
            <XAxis dataKey={xAxisKey} stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          </>
        ) : (
          <>
            <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis dataKey={xAxisKey} type="category" stroke="#6b7280" style={{ fontSize: '12px' }} />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        {showLegend && <Legend />}
        {defaultBars.map((bar, index) => (
          <Bar
            key={bar.dataKey || index}
            dataKey={bar.dataKey}
            fill={bar.fill || CHART_COLORS.primary}
            radius={[4, 4, 0, 0]}
            name={bar.name}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
