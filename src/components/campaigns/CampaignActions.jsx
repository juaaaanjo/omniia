import { useState } from 'react';
import { FiPause, FiPlay, FiRotateCcw } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import { useLanguage } from '../../hooks/useLanguage';
import dataService from '../../services/dataService';

const CampaignActions = ({ campaign, onSuccess, onError }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);

  const handlePause = async () => {
    const reason = prompt(t.campaigns.actions.pauseReason);
    if (reason === null) return; // User canceled

    setLoading(true);
    setAction('pause');
    try {
      await dataService.pauseCampaign(campaign.id || campaign._id, reason || 'Manual pause by user');
      onSuccess?.(t.campaigns.actions.pauseSuccess);
    } catch (error) {
      onError?.(error.message || t.campaigns.actions.pauseError);
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const handleActivate = async () => {
    const reason = prompt(t.campaigns.actions.activateReason);
    if (reason === null) return; // User canceled

    setLoading(true);
    setAction('activate');
    try {
      await dataService.activateCampaign(campaign.id || campaign._id, reason || 'Manual activation by user');
      onSuccess?.(t.campaigns.actions.activateSuccess);
    } catch (error) {
      onError?.(error.message || t.campaigns.actions.activateError);
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const handleRollback = async () => {
    if (!window.confirm(t.campaigns.actions.rollbackConfirm)) {
      return;
    }

    setLoading(true);
    setAction('rollback');
    try {
      await dataService.rollbackCampaign(campaign.id || campaign._id);
      onSuccess?.(t.campaigns.actions.rollbackSuccess);
    } catch (error) {
      onError?.(error.message || t.campaigns.actions.rollbackError);
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  const isActive = campaign.status === 'ACTIVE' || campaign.status === 'active';
  const isPaused = campaign.status === 'PAUSED' || campaign.status === 'paused';

  return (
    <div className="flex gap-2">
      {isActive && (
        <button
          onClick={handlePause}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
          title={t.campaigns.actions.pause}
        >
          {loading && action === 'pause' ? (
            <LoadingSpinner size="sm" />
          ) : (
            <FiPause className="w-4 h-4" />
          )}
          {t.campaigns.actions.pause}
        </button>
      )}

      {isPaused && (
        <button
          onClick={handleActivate}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          title={t.campaigns.actions.activate}
        >
          {loading && action === 'activate' ? (
            <LoadingSpinner size="sm" />
          ) : (
            <FiPlay className="w-4 h-4" />
          )}
          {t.campaigns.actions.activate}
        </button>
      )}

      <button
        onClick={handleRollback}
        disabled={loading}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        title={t.campaigns.actions.rollback}
      >
        {loading && action === 'rollback' ? (
          <LoadingSpinner size="sm" />
        ) : (
          <FiRotateCcw className="w-4 h-4" />
        )}
        {t.campaigns.actions.rollback}
      </button>
    </div>
  );
};

export default CampaignActions;
