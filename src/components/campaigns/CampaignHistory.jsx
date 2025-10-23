import { useEffect, useState } from 'react';
import { FiClock, FiRotateCcw, FiCheckCircle } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import { useLanguage } from '../../hooks/useLanguage';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import dataService from '../../services/dataService';

const CampaignHistory = ({ campaignId, isOpen, onClose }) => {
  const { t } = useLanguage();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rollingBack, setRollingBack] = useState(null);

  useEffect(() => {
    if (isOpen && campaignId) {
      loadHistory();
    }
  }, [isOpen, campaignId]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataService.getCampaignHistory(campaignId, { limit: 20 });
      setHistory(response.data?.history || []);
    } catch (err) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (historyId, entry) => {
    if (!window.confirm(`${t.campaigns.history.rollbackConfirm}\n\n${entry.reason || ''}`)) {
      return;
    }

    setRollingBack(historyId);
    try {
      await dataService.rollbackCampaign(campaignId, historyId);
      await loadHistory();
      // Show success message
    } catch (err) {
      setError(err.message || 'Failed to rollback');
    } finally {
      setRollingBack(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {t.campaigns.history.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-4 max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={loadHistory}
                  className="mt-4 text-blue-600 hover:text-blue-700"
                >
                  {t.common.retry}
                </button>
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">{t.campaigns.history.noHistory}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((entry) => (
                  <div
                    key={entry._id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FiClock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatDate(entry.executedAt, 'MMM dd, yyyy HH:mm')}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({formatRelativeTime(entry.executedAt)})
                          </span>
                        </div>

                        <div className="mb-2">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                              entry.action === 'pause'
                                ? 'bg-yellow-100 text-yellow-800'
                                : entry.action === 'activate'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {entry.action.toUpperCase()}
                          </span>
                        </div>

                        {entry.reason && (
                          <p className="text-sm text-gray-700 mb-2">{entry.reason}</p>
                        )}

                        {entry.previousState?.status && entry.newState?.status && (
                          <div className="text-sm text-gray-600">
                            <span>{entry.previousState.status}</span>
                            <span className="mx-2">→</span>
                            <span className="font-semibold">{entry.newState.status}</span>
                          </div>
                        )}

                        {entry.rolledBackAt && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                            <FiCheckCircle className="w-4 h-4" />
                            <span>{t.campaigns.history.rolledBack}</span>
                          </div>
                        )}
                      </div>

                      {entry.canRollback && !entry.rolledBackAt && (
                        <button
                          onClick={() => handleRollback(entry._id, entry)}
                          disabled={rollingBack === entry._id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {rollingBack === entry._id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <FiRotateCcw className="w-4 h-4" />
                          )}
                          {t.campaigns.history.rollbackToThis}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignHistory;
