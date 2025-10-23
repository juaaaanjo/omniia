import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

const LineChart = ({
  data = [],
  lines = [],
  xAxisKey = 'date',
  height = 300,
  showGrid = true,
  showLegend = true,
}) => {
  // Default line if none provided
  const defaultLines = lines.length > 0 ? lines : [
    { dataKey: 'value', stroke: CHART_COLORS.primary, name: 'Value' }
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
        <XAxis
          dataKey={xAxisKey}
          stroke="#6b7280"
          style={{ fontSize: '12px' }}
        />
        <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        {showLegend && <Legend />}
        {defaultLines.map((line, index) => (
          <Line
            key={line.dataKey || index}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke || CHART_COLORS.primary}
            strokeWidth={2}
            dot={{ fill: line.stroke || CHART_COLORS.primary, r: 4 }}
            activeDot={{ r: 6 }}
            name={line.name}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
