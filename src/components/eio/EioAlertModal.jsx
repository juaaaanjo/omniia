import { useEffect, useState } from 'react';
import { FiX, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useLanguage } from '../../hooks/useLanguage';
import { formatDate, formatRelativeTime, formatCurrency, truncateText } from '../../utils/formatters';

const severityClasses = {
  critical: 'bg-rose-100 text-rose-700 border border-rose-200',
  high: 'bg-amber-100 text-amber-700 border border-amber-200',
  medium: 'bg-blue-100 text-blue-700 border border-blue-200',
  low: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  info: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const statusClasses = {
  pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  applied: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  in_review: 'bg-blue-100 text-blue-700 border border-blue-200',
  inReview: 'bg-blue-100 text-blue-700 border border-blue-200',
  resolved: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  ignored: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const normalizeStatus = (status) => status?.toLowerCase().replace(/\s+/g, '_') || 'pending';

const EioAlertModal = ({ isOpen, alert, onClose, onAction, loading }) => {
  const { translate } = useLanguage();
  const [notes, setNotes] = useState('');
  const [createPlan, setCreatePlan] = useState(false);
  const [ignoreDays, setIgnoreDays] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setNotes('');
      setCreatePlan(false);
      setIgnoreDays('');
      setFeedback(null);
    }
  }, [isOpen, alert?._id]);

  if (!isOpen || !alert) {
    return null;
  }

  const resolveTranslation = (key, fallback) => {
    const value = translate(key);
    return value === key ? fallback : value;
  };

  const handleAction = async (action) => {
    try {
      const payload = {};
      if (notes) {
        payload.notes = notes;
      }
      if (action === 'apply' && createPlan) {
        payload.createPlan = true;
      }
      if (action === 'ignore') {
        if (notes) {
          payload.reason = notes;
        }
        if (ignoreDays) {
          payload.ignoreForDays = Number(ignoreDays);
        }
      }

      await onAction(action, alert._id, payload);
      setFeedback({
        type: 'success',
        text: translate(`dashboard.eio.messages.${action}Success`),
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err.message || translate('dashboard.eio.messages.error'),
      });
    }
  };

  const statusKey = normalizeStatus(alert.status);

  const recommendedActions = Array.isArray(alert.recommendedActions)
    ? alert.recommendedActions
    : alert.recommendedActions?.actions || [];

  const viewedBy =
    Array.isArray(alert.viewedBy) && alert.viewedBy.length > 0
      ? alert.viewedBy
      : [];

  const contextEntries = alert.contextData && typeof alert.contextData === 'object'
    ? Object.entries(alert.contextData)
    : [];

  const metricChange = alert.metric?.changePercentage;

  const formattedStatusLabel = resolveTranslation(
    `dashboard.eio.statusLabels.${statusKey}`,
    alert.status || statusKey,
  );

  const severityKey = normalizeStatus(alert.severity || alert.type);
  const severityLabel = resolveTranslation(`dashboard.eio.severity.${severityKey}`, alert.severity || severityKey);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4 bg-white">
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {translate('dashboard.eio.detail.category')} · {alert.category}
            </p>
            <h3 className="mt-2 text-xl font-medium text-gray-900">{alert.title}</h3>
            {alert.description && (
              <p className="mt-2 text-sm font-normal text-gray-600">{alert.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 p-2 text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${severityClasses[normalizeStatus(alert.severity)] || severityClasses.low}`}>
              <FiAlertCircle className="mr-1 h-4 w-4" />
              {severityLabel}
            </span>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusClasses[statusKey] || statusClasses.pending}`}>
              <FiCheckCircle className="mr-1 h-4 w-4" />
              {formattedStatusLabel}
            </span>
            {alert.type && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {resolveTranslation(`dashboard.eio.types.${alert.type}`, alert.type)}
              </span>
            )}
          </div>

          {alert.metric && (
            <div>
              <div className="flex items-center gap-3 relative mb-3">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-200 rounded-full"></div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 pl-4">
                  {translate('dashboard.eio.detail.metricTitle')}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-normal text-gray-500 mb-1">
                      {translate('dashboard.eio.detail.metricName')}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {alert.metric.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-normal text-gray-500 mb-1">
                      {translate('dashboard.eio.detail.metricCurrent')}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {alert.metric.unit === 'currency'
                        ? formatCurrency(alert.metric.currentValue)
                        : alert.metric.currentValue}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-normal text-gray-500 mb-1">
                      {translate('dashboard.eio.detail.metricPrevious')}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {alert.metric.unit === 'currency'
                        ? formatCurrency(alert.metric.previousValue)
                        : alert.metric.previousValue}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-normal text-gray-500 mb-1">
                      {translate('dashboard.eio.detail.metricChange')}
                    </p>
                    <p className={`text-sm font-medium ${metricChange > 0 ? 'text-emerald-600' : metricChange < 0 ? 'text-rose-600' : 'text-gray-700'}`}>
                      {metricChange != null ? `${metricChange.toFixed(2)}%` : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {Array.isArray(alert.insights) && alert.insights.length > 0 && (
            <div>
              <div className="flex items-center gap-3 relative mb-3">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-200 rounded-full"></div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 pl-4">
                  {translate('dashboard.eio.detail.insights')}
                </p>
              </div>
              <ul className="space-y-2">
                {alert.insights.map((insight) => (
                  <li key={insight} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-normal text-gray-700">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recommendedActions.length > 0 && (
            <div>
              <div className="flex items-center gap-3 relative mb-3">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-200 rounded-full"></div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 pl-4">
                  {translate('dashboard.eio.detail.recommendedActions')}
                </p>
              </div>
              <div className="space-y-3">
                {recommendedActions.map((action) => (
                  <div key={action._id || action.title} className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {action.title}
                        </p>
                        <p className="mt-1 text-sm font-normal text-gray-600">
                          {truncateText(action.description, 160)}
                        </p>
                        {action.estimatedImpact && (
                          <p className="mt-2 text-xs font-normal text-gray-500">
                            {translate('dashboard.eio.detail.estimatedImpact', {
                              impact: action.estimatedImpact,
                            })}
                          </p>
                        )}
                      </div>
                      {action.applied && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 flex-shrink-0">
                          <FiCheckCircle className="mr-1 h-4 w-4" />
                          {translate('dashboard.eio.detail.actionApplied')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500 mb-3">
              {translate('dashboard.eio.detail.timeline')}
            </p>
            <ul className="space-y-2 text-sm font-normal text-gray-600">
              {alert.detectedAt && (
                <li className="flex items-center gap-2">
                  <FiAlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span>{translate('dashboard.eio.detail.detectedAt', {
                    time: formatRelativeTime(alert.detectedAt),
                  })}</span>
                </li>
              )}
              {alert.updatedAt && (
                <li className="flex items-center gap-2">
                  <FiClock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span>{translate('dashboard.eio.detail.updatedAt', {
                    time: formatRelativeTime(alert.updatedAt),
                  })}</span>
                </li>
              )}
              {alert.resolvedAt && (
                <li className="flex items-center gap-2">
                  <FiCheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <span>{translate('dashboard.eio.detail.resolvedAt', {
                    time: formatRelativeTime(alert.resolvedAt),
                  })}</span>
                </li>
              )}
            </ul>
          </div>

          {contextEntries.length > 0 && (
            <div>
              <div className="flex items-center gap-3 relative mb-3">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-200 rounded-full"></div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 pl-4">
                  {translate('dashboard.eio.detail.context')}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {contextEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-3"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-1">{key}</p>
                    <p className="text-sm font-normal text-gray-800">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {viewedBy.length > 0 && (
            <div>
              <div className="flex items-center gap-3 relative mb-3">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-200 rounded-full"></div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 pl-4">
                  {translate('dashboard.eio.detail.viewedBy')}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {viewedBy.map((viewer) => (
                  <span
                    key={viewer.userId || viewer.email || viewer}
                    className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-normal text-gray-600"
                  >
                    {viewer.userName || viewer.userEmail || viewer}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          {feedback && (
            <div
              className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
                feedback.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-rose-200 bg-rose-50 text-rose-700'
              }`}
            >
              {feedback.text}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-3 relative mb-3">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-200 rounded-full"></div>
                <label className="text-sm font-medium text-gray-700 pl-4">
                  {translate('dashboard.eio.detail.notesLabel')}
                </label>
              </div>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder={translate('dashboard.eio.detail.notesPlaceholder')}
              />
            </div>

            <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createPlan}
                  onChange={(event) => setCreatePlan(event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
                <span className="font-normal text-gray-700">{translate('dashboard.eio.detail.createPlan')}</span>
              </label>
              <div className="flex items-center gap-2">
                <label className="font-normal text-gray-700">{translate('dashboard.eio.detail.ignoreForDays')}</label>
                <input
                  type="number"
                  min="0"
                  value={ignoreDays}
                  onChange={(event) => setIgnoreDays(event.target.value)}
                  className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleAction('ignore')}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {translate('dashboard.eio.actions.ignore')}
              </button>
              <button
                type="button"
                onClick={() => handleAction('review')}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 disabled:opacity-50 transition-colors"
              >
                {translate('dashboard.eio.actions.review')}
              </button>
              <button
                type="button"
                onClick={() => handleAction('resolve')}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-emerald-600 bg-white border border-emerald-200 rounded-lg hover:bg-emerald-50 disabled:opacity-50 transition-colors"
              >
                {translate('dashboard.eio.actions.resolve')}
              </button>
              <button
                type="button"
                onClick={() => handleAction('apply')}
                disabled={loading}
                className="ml-auto px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors inline-flex items-center gap-2"
              >
                {loading && <FiClock className="h-4 w-4 animate-spin" />}
                {translate('dashboard.eio.actions.apply')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EioAlertModal;
