import { useEffect, useMemo, useState } from 'react';
import { FiRefreshCcw, FiCheckCircle, FiX } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import { useEio } from '../../hooks/useEio';
import { formatRelativeTime, truncateText } from '../../utils/formatters';
import EioAlertModal from './EioAlertModal';

const statusIconClasses = {
  pending: 'bg-amber-100 text-amber-600 border border-amber-200',
  applied: 'bg-emerald-100 text-emerald-600 border border-emerald-200',
  inReview: 'bg-blue-100 text-blue-600 border border-blue-200',
};

const insightDotColors = {
  positive: 'bg-emerald-500',
  negative: 'bg-rose-500',
  neutral: 'bg-gray-400',
  recommendations: 'bg-primary-500',
};

const EioOverviewCard = () => {
  const { translate } = useLanguage();
  const {
    summary,
    statusHighlights,
    dailyInsights,
    overviewLoading,
    detailLoading,
    actionLoading,
    fetchOverview,
    fetchAlertDetail,
    executeAction,
    triggerScan,
    selectedAlert,
    setSelectedAlert,
  } = useEio();
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    fetchOverview().catch((err) => {
      console.error('Failed to load EIO overview:', err);
    });
  }, [fetchOverview]);

  const insight = useMemo(() => {
    if (!dailyInsights) return null;

    if (dailyInsights.positive?.length) {
      return { type: 'positive', text: dailyInsights.positive[0] };
    }
    if (dailyInsights.negative?.length) {
      return { type: 'negative', text: dailyInsights.negative[0] };
    }
    if (dailyInsights.recommendations?.length) {
      return { type: 'recommendations', text: dailyInsights.recommendations[0] };
    }
    if (dailyInsights.neutral?.length) {
      return { type: 'neutral', text: dailyInsights.neutral[0] };
    }
    return null;
  }, [dailyInsights]);

  const handleViewDetail = async (alert) => {
    if (!alert?._id) return;
    try {
      await fetchAlertDetail(alert._id);
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || translate('dashboard.eio.messages.error'),
      });
    }
  };

  const handleQuickAction = async (action, alert) => {
    if (!alert?._id) return;

    try {
      await executeAction(action, alert._id, {});
      setFeedbackMessage({
        type: 'success',
        text: translate(`dashboard.eio.messages.${action}Success`),
      });
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || translate('dashboard.eio.messages.error'),
      });
    }
  };

  const handleTriggerScan = async () => {
    try {
      await triggerScan();
      setFeedbackMessage({
        type: 'success',
        text: translate('dashboard.eio.messages.scanTriggered'),
      });
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: err.message || translate('dashboard.eio.messages.error'),
      });
    }
  };

  const closeModal = () => {
    setSelectedAlert(null);
  };

  const statusCards = [
    {
      key: 'pending',
      title: translate('dashboard.eio.status.pending.title'),
      helper: translate('dashboard.eio.status.pending.helper', {
        count: summary?.pending ?? 0,
      }),
      chipClass: statusIconClasses.pending,
      highlight: statusHighlights.pending,
      actions: ['apply', 'ignore', 'view'],
    },
    {
      key: 'applied',
      title: translate('dashboard.eio.status.applied.title'),
      helper: translate('dashboard.eio.status.applied.helper', {
        count: summary?.applied ?? 0,
      }),
      chipClass: statusIconClasses.applied,
      highlight: statusHighlights.applied,
      actions: ['view'],
    },
    {
      key: 'inReview',
      title: translate('dashboard.eio.status.inReview.title'),
      helper: translate('dashboard.eio.status.inReview.helper', {
        count: summary?.inReview ?? 0,
      }),
      chipClass: statusIconClasses.inReview,
      highlight: statusHighlights.inReview,
      actions: ['review', 'view'],
    },
  ];

  const resolveActionLabel = (action) => {
    switch (action) {
      case 'apply':
        return translate('dashboard.eio.actions.apply');
      case 'ignore':
        return translate('dashboard.eio.actions.ignore');
      case 'review':
        return translate('dashboard.eio.actions.review');
      case 'resolve':
        return translate('dashboard.eio.actions.resolve');
      case 'view':
      default:
        return translate('dashboard.eio.actions.viewDetail');
    }
  };

  const highlightDescription = (alert) => {
    if (!alert) return translate('dashboard.eio.emptyState');
    if (alert.description) return truncateText(alert.description, 80);
    if (alert.metric?.name && alert.metric?.changePercentage !== undefined) {
      return `${alert.metric.name}: ${alert.metric.changePercentage.toFixed(2)}%`;
    }
    return translate('dashboard.eio.emptyState');
  };

  return (
    <div className="card p-6">
      {/* Header with gradient left border like SectionHeader */}
      <div className="relative mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-200 rounded-full"></div>
            <h2 className="text-xl font-medium text-gray-900 pl-4">
              {translate('dashboard.eio.title')}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm font-normal text-gray-500 whitespace-nowrap">
              {translate('dashboard.eio.subtitle')}
            </p>
            <button
              onClick={handleTriggerScan}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
              disabled={overviewLoading || actionLoading}
              type="button"
            >
              <FiRefreshCcw className={`h-4 w-4 ${overviewLoading || actionLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {feedbackMessage && (
        <div
          className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
            feedbackMessage.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {feedbackMessage.text}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {statusCards.map((card) => {
          const dotColor = card.key === 'pending' ? 'bg-orange-500' : card.key === 'applied' ? 'bg-green-500' : 'bg-blue-500';

          return (
            <div key={card.key} className="space-y-4">
              {/* Column Header */}
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></div>
                <h3 className="text-base font-normal text-gray-900">{card.title}</h3>
                <span className="text-base font-normal text-gray-400">
                  {summary?.[card.key] ?? 0}
                </span>
              </div>

              {/* Alert Card */}
              {card.highlight ? (
                <div className="card card-hover p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-2xl">📊</div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {card.highlight.title || highlightDescription(card.highlight)}
                      </h4>
                      {card.highlight.description && (
                        <p className="text-sm font-normal text-gray-500">
                          {truncateText(card.highlight.description, 60)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
                    <span className="text-xs font-normal text-gray-500">
                      {card.highlight.detectedAt ? formatRelativeTime(card.highlight.detectedAt) : '2.3h'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {card.actions.includes('apply') && (
                      <button
                        onClick={() => handleQuickAction('apply', card.highlight)}
                        disabled={actionLoading}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 text-sm"
                        type="button"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        {resolveActionLabel('apply')}
                      </button>
                    )}
                    {card.actions.includes('ignore') && (
                      <button
                        onClick={() => handleQuickAction('ignore', card.highlight)}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-60 text-sm"
                        type="button"
                      >
                        <FiX className="w-4 h-4" />
                        {resolveActionLabel('ignore')}
                      </button>
                    )}
                    {(card.actions.includes('view') || card.actions.includes('review')) && (
                      <button
                        onClick={() => handleViewDetail(card.highlight)}
                        disabled={detailLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-60 text-sm ml-auto"
                        type="button"
                      >
                        <span>👁️</span>
                        <span className="text-sm font-normal">{resolveActionLabel('view')}</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="card p-4 text-center">
                  <span className="text-sm font-normal text-gray-400">
                    {translate('dashboard.eio.emptyState')}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 space-y-4">
        {/* Insights Section */}
        <div className="relative">
          <div className="flex items-center gap-3 relative mb-4">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-200 rounded-full"></div>
            <h3 className="text-base font-medium text-gray-900 pl-4">
              {translate('dashboard.eio.insights.title')}
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
            {dailyInsights?.generatedAt && (
              <p className="text-sm font-normal text-gray-500 whitespace-nowrap">
                {translate('dashboard.eio.insights.subtitle')}
              </p>
            )}
          </div>
          <div className="card p-4">
            <p className="text-sm font-normal text-gray-700">
              {insight ? (
                <span className="flex items-start gap-2">
                  <span
                    className={`mt-1 h-2 w-2 rounded-full ${
                      insightDotColors[insight.type] || insightDotColors.neutral
                    }`}
                  />
                  <span>{insight.text}</span>
                </span>
              ) : (
                translate('dashboard.eio.insights.empty')
              )}
            </p>
          </div>
        </div>

      </div>

      {selectedAlert && (
        <EioAlertModal
          isOpen={Boolean(selectedAlert)}
          alert={selectedAlert}
          onClose={closeModal}
          onAction={executeAction}
          loading={actionLoading}
        />
      )}
    </div>
  );
};

export default EioOverviewCard;
