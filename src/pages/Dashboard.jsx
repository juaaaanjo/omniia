import { useEffect, useMemo, useState } from 'react';
import {
  FiTrendingUp,
  FiDollarSign,
  FiDatabase,
  FiHeart,
  FiZap
} from 'react-icons/fi';
import { useData } from '../hooks/useData';
import { useChat } from '../hooks/useChat';
import QuickActionButton from '../components/common/QuickActionButton';
import CategoryCard from '../components/common/CategoryCard';
import SectionHeader from '../components/common/SectionHeader';
import EioOverviewCard from '../components/eio/EioOverviewCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { useLanguage } from '../hooks/useLanguage';
import dataService from '../services/dataService';

const Dashboard = () => {
  const { kpis, fetchKPIs, isLoading, dateRange } = useData();
  const { t, translate } = useLanguage();
  const { openChat, sendMessage } = useChat();
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    fetchKPIs();
  }, [fetchKPIs, dateRange]);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        setMetricsLoading(true);
        const metrics = await dataService.getAllMetrics(dateRange);
        setDashboardMetrics(metrics);
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        setDashboardMetrics(null);
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, [dateRange]);

  const { revenue = {}, marketing = {}, payments = {}, finance = {}, dateRange: kpiDateRange } = kpis || {};

  const marginValue =
    finance.margin != null && !Number.isNaN(finance.margin) ? finance.margin / 100 : null;

  // Extract metrics data with fallbacks
  const retention = dashboardMetrics?.retention || {};
  const growth = dashboardMetrics?.growth || {};
  const dataQuality = dashboardMetrics?.dataQuality || {};
  const sac = dashboardMetrics?.sac || {};

  // Category cards data
  const categoryCards = useMemo(
    () => {
      const cards = [
        {
          category: 'marketing',
          title: translate('dashboard.categories.marketing.title'),
          icon: FiTrendingUp,
          metrics: [
            {
              label: translate('dashboard.categories.marketing.roas'),
              value: (marketing.roas ?? 0).toFixed(1),
            },
            {
              label: translate('dashboard.categories.marketing.cpa'),
              value: formatCurrency(marketing.cpc ?? 0),
            },
            {
              label: translate('dashboard.categories.marketing.ctr'),
              value: marketing.ctr ? `${(marketing.ctr * 100).toFixed(1)}%` : '0%',
            },
          ],
        },
        {
          category: 'finance',
          title: translate('dashboard.categories.finance.title'),
          icon: FiDollarSign,
          metrics: [
            {
              label: translate('dashboard.categories.finance.monthlyRevenue'),
              value: formatCurrency(finance.revenue ?? payments.totalRevenue ?? 0),
            },
            {
              label: translate('dashboard.categories.finance.margin'),
              value: marginValue ? formatPercentage(marginValue) : '0%',
            },
            {
              label: translate('dashboard.categories.finance.cashDifference'),
              value: formatCurrency(120000),
            },
          ],
        },
        {
          category: 'retention',
          title: translate('dashboard.categories.retention.title'),
          icon: FiZap,
          metrics: [
            {
              label: translate('dashboard.categories.retention.retention'),
              value: retention.retentionRate != null ? `${retention.retentionRate}%` : '0%',
            },
            {
              label: translate('dashboard.categories.retention.newCustomers'),
              value: retention.newCustomers != null ? `+${retention.newCustomers}` : '+0',
            },
            {
              label: translate('dashboard.categories.retention.avgLtv'),
              value: formatCurrency(retention.averageLTV ?? 0),
            },
          ],
        },
        {
          category: 'growth',
          title: translate('dashboard.categories.growth.title'),
          icon: FiZap,
          metrics: [
            {
              label: translate('dashboard.categories.growth.promiseTime'),
              value: growth.averageTimeToConversionHours != null
                ? `${growth.averageTimeToConversionHours}h`
                : '0h',
            },
            {
              label: translate('dashboard.categories.growth.conversion'),
              value: growth.conversionRate != null ? `${growth.conversionRate}%` : '0%',
            },
          ],
        },
        {
          category: 'data',
          title: translate('dashboard.categories.data.title'),
          icon: FiDatabase,
          metrics: [
            {
              label: translate('dashboard.categories.data.quality'),
              value: dataQuality.qualityScore != null ? `${dataQuality.qualityScore}%` : '0%',
            },
            {
              label: translate('dashboard.categories.data.connectedSources'),
              value: dataQuality.connectedSources != null ? `${dataQuality.connectedSources}` : '0',
            },
            {
              label: translate('dashboard.categories.data.precision'),
              value: dataQuality.precision != null ? `${dataQuality.precision}%` : '0%',
            },
          ],
        },
      ];

      // Only show SAC card if there's actual data
      if (sac.resolutionRate != null && sac.resolutionRate > 0) {
        cards.splice(2, 0, {
          category: 'sac',
          title: translate('dashboard.categories.sac.title'),
          icon: FiHeart,
          metrics: [
            {
              label: translate('dashboard.categories.sac.resolvedCases'),
              value: `${sac.resolutionRate}%`,
            },
            {
              label: translate('dashboard.categories.sac.avgResponseTime'),
              value: sac.averageFirstResponseTimeHours != null
                ? `${sac.averageFirstResponseTimeHours}h`
                : '0h',
            },
          ],
        });
      }

      return cards;
    },
    [
      finance.revenue,
      finance.margin,
      marginValue,
      marketing.cpc,
      marketing.ctr,
      marketing.roas,
      payments.totalRevenue,
      retention.retentionRate,
      retention.newCustomers,
      retention.averageLTV,
      growth.conversionRate,
      growth.averageTimeToConversionHours,
      dataQuality.qualityScore,
      dataQuality.connectedSources,
      dataQuality.precision,
      sac.resolutionRate,
      sac.averageFirstResponseTimeHours,
      sac,
      translate,
    ]
  );

  // Quick Action handlers
  const handleQuickAction = (actionType) => {
    let message = '';

    switch (actionType) {
      case 'performanceSummary':
        message = translate('dashboard.quickActions.performanceSummary');
        break;
      case 'salesAnalysis':
        message = translate('dashboard.quickActions.salesAnalysis');
        break;
      default:
        message = actionType;
    }

    // Open chat and send the message
    openChat();
    setTimeout(() => {
      sendMessage(message);
    }, 300); // Small delay to ensure chat is open
  };

  if ((isLoading && !kpis) || (metricsLoading && !dashboardMetrics)) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message={translate('dashboard.loading')} />
      </div>
    );
  }

  return (
    <div className="space-y-section">
      {/* Quick Actions */}
      <div>
        <SectionHeader
          title={translate('dashboard.quickActions.title')}
          borderColor="border-primary-500"
        />
        <div className="flex flex-wrap gap-3">
          <QuickActionButton
            label={translate('dashboard.quickActions.performanceSummary')}
            onClick={() => handleQuickAction('performanceSummary')}
          />
          <QuickActionButton
            label={translate('dashboard.quickActions.salesAnalysis')}
            onClick={() => handleQuickAction('salesAnalysis')}
          />
        </div>
      </div>

      {/* Categories Section */}
      <div>
        <SectionHeader
          title={translate('dashboard.categories.title')}
          subtitle={translate('dashboard.categories.subtitle')}
          borderColor="border-primary-500"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryCards.map((card) => (
            <CategoryCard key={card.category} {...card} />
          ))}
        </div>
      </div>

      {/* EIO Section */}
      <div>
        <EioOverviewCard />
      </div>
    </div>
  );
};

export default Dashboard;
