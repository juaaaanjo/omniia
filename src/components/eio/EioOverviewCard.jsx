import { useEffect, useMemo, useState } from 'react';
import { FiRefreshCcw, FiMail, FiMessageCircle, FiArrowRight } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import { useEio } from '../../hooks/useEio';
import { useData } from '../../hooks/useData';
import { useChat } from '../../hooks/useChat';
import { getDateRangeParams } from '../../utils/dateHelpers';
import { formatDate, formatRelativeTime, truncateText } from '../../utils/formatters';
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
  const { t, translate } = useLanguage();
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
    requestReport,
    triggerScan,
    selectedAlert,
    setSelectedAlert,
  } = useEio();
  const { dateRange } = useData();
  const { openChat, updateContext } = useChat();

  const [reportLoading, setReportLoading] = useState(false);
  const [reportMessage, setReportMessage] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    fetchOverview().catch((err) => {
      console.error('Failed to load EIO overview:', err);
    });
  }, [fetchOverview]);

  const { startDate, endDate } = useMemo(() => getDateRangeParams(dateRange), [dateRange]);

  const reportPeriodLabel = useMemo(() => {
    if (!startDate || !endDate) return '';
    return `${formatDate(startDate, 'dd MMM')} – ${formatDate(endDate, 'dd MMM')}`;
  }, [startDate, endDate]);

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

  const handleSendReport = async () => {
    try {
      setReportLoading(true);
      setReportMessage(null);
      await requestReport({
        startDate,
        endDate,
        format: 'email',
      });
      setReportMessage({
        type: 'success',
        text: translate('dashboard.eio.messages.reportSent'),
      });
    } catch (err) {
      setReportMessage({
        type: 'error',
        text: err.message || translate('dashboard.eio.messages.error'),
      });
    } finally {
      setReportLoading(false);
    }
  };

  const handleOpenChat = () => {
    openChat();
    updateContext({
      topic: 'eio',
      summary,
    });
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="text-3xl" role="img" aria-label="EIO">
            🧠
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {translate('dashboard.eio.title')}
            </h2>
            <p className="text-sm text-gray-500">
              {translate('dashboard.eio.subtitle')}
            </p>
            {summary?.lastAlertTime && (
              <p className="mt-2 text-xs text-gray-400">
                {translate('dashboard.eio.lastAlert', {
                  time: formatRelativeTime(summary.lastAlertTime),
                })}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={handleTriggerScan}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
            disabled={overviewLoading || actionLoading}
            type="button"
          >
            <FiRefreshCcw className={`h-4 w-4 ${overviewLoading || actionLoading ? 'animate-spin' : ''}`} />
            {translate('dashboard.eio.actions.refresh')}
          </button>
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

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {statusCards.map((card) => (
          <div key={card.key} className="rounded-xl border border-gray-200 bg-white/60 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-800">{card.title}</p>
                <p className="text-xs text-gray-500">{card.helper}</p>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${card.chipClass}`}>
                {(summary?.[card.key] ?? 0).toLocaleString()}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-600 min-h-[3.5rem]">
              {highlightDescription(card.highlight)}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              {card.actions.includes('apply') && card.highlight && (
                <button
                  onClick={() => handleQuickAction('apply', card.highlight)}
                  disabled={actionLoading}
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-60"
                  type="button"
                >
                  {resolveActionLabel('apply')}
                </button>
              )}
              {card.actions.includes('ignore') && card.highlight && (
                <button
                  onClick={() => handleQuickAction('ignore', card.highlight)}
                  disabled={actionLoading}
                  className="font-medium text-gray-500 hover:text-gray-600 transition-colors disabled:opacity-60"
                  type="button"
                >
                  {resolveActionLabel('ignore')}
                </button>
              )}
              {card.actions.includes('review') && card.highlight && (
                <button
                  onClick={() => handleQuickAction('review', card.highlight)}
                  disabled={actionLoading}
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors disabled:opacity-60"
                  type="button"
                >
                  {resolveActionLabel('review')}
                </button>
              )}
              {card.actions.includes('view') && card.highlight && (
                <button
                  onClick={() => handleViewDetail(card.highlight)}
                  disabled={detailLoading}
                  className="inline-flex items-center gap-1 font-medium text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-60"
                  type="button"
                >
                  {resolveActionLabel('view')}
                  <FiArrowRight className="h-4 w-4" />
                </button>
              )}
              {!card.highlight && (
                <span className="text-sm text-gray-400">
                  {translate('dashboard.eio.emptyState')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <p className="text-sm font-semibold text-gray-800">
              {translate('dashboard.eio.insights.title')}
            </p>
            {dailyInsights?.generatedAt && (
              <span className="text-xs text-gray-500">
                {translate('dashboard.eio.insights.generatedAt', {
                  time: formatRelativeTime(dailyInsights.generatedAt),
                })}
              </span>
            )}
          </div>
          <p className="mt-3 text-sm text-gray-700">
            {insight ? (
              <span className="flex items-start gap-2">
                <span
                  className={`mt-1 h-2.5 w-2.5 rounded-full ${
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <button
            onClick={handleSendReport}
            className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-60"
            disabled={reportLoading}
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-gray-200 p-3 text-gray-600">
                <FiMail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {translate('dashboard.eio.report.title')}
                </p>
                <p className="text-xs text-gray-500">
                  {translate('dashboard.eio.report.subtitle', {
                    range: reportPeriodLabel,
                  })}
                </p>
              </div>
            </div>
            <FiArrowRight className="h-4 w-4 text-gray-400" />
          </button>

          <button
            onClick={handleOpenChat}
            className="flex items-center justify-between gap-4 rounded-xl bg-emerald-600 px-5 py-4 text-left text-white shadow-sm transition-colors hover:bg-emerald-700"
            type="button"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-3 text-white">
                <FiMessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {translate('dashboard.eio.chat.title')}
                </p>
                <p className="text-xs text-emerald-100">
                  {translate('dashboard.eio.chat.subtitle')}
                </p>
              </div>
            </div>
            <FiArrowRight className="h-4 w-4" />
          </button>
        </div>

        {(reportMessage || reportLoading) && (
          <div
            className={`rounded-lg border px-3 py-2 text-sm ${
              reportMessage?.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : reportMessage?.type === 'error'
                  ? 'border-rose-200 bg-rose-50 text-rose-700'
                  : 'border-gray-200 bg-gray-50 text-gray-600'
            }`}
          >
            {reportLoading
              ? translate('dashboard.eio.report.sending')
              : reportMessage?.text}
          </div>
        )}
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
