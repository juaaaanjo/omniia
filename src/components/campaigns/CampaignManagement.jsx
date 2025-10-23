import { useEffect, useMemo, useState } from 'react';
import {
  FiRefreshCw,
  FiShield,
  FiClock,
} from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import CampaignActions from './CampaignActions';
import CampaignHistory from './CampaignHistory';
import GuardrailForm from '../guardrails/GuardrailForm';
import { useLanguage } from '../../hooks/useLanguage';
import dataService from '../../services/dataService';
import {
  formatCurrency,
  formatNumber,
  formatRelativeTime,
} from '../../utils/formatters';

const getCampaignId = (campaign) =>
  campaign?.id || campaign?._id || campaign?.campaignId || null;

const statusStyles = {
  ACTIVE: 'bg-green-100 text-green-700',
  PAUSED: 'bg-yellow-100 text-yellow-700',
  ARCHIVED: 'bg-gray-100 text-gray-600',
  COMPLETED: 'bg-blue-100 text-blue-700',
  UNKNOWN: 'bg-gray-100 text-gray-600',
};

const normalizeCampaigns = (payload) => {
  if (!payload) return [];

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.campaigns)) {
    return payload.campaigns;
  }

  if (Array.isArray(payload.guardrails)) {
    return payload.guardrails;
  }

  if (payload.data) {
    if (Array.isArray(payload.data.campaigns)) {
      return payload.data.campaigns;
    }
    if (Array.isArray(payload.data.guardrails)) {
      return payload.data.guardrails;
    }
    if (Array.isArray(payload.data)) {
      return payload.data;
    }
  }

  return [];
};

const CampaignManagement = () => {
  const { t, translate } = useLanguage();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [historyCampaign, setHistoryCampaign] = useState(null);
  const [guardrailCampaign, setGuardrailCampaign] = useState(null);
  const [selectedGuardrail, setSelectedGuardrail] = useState(null);
  const [guardrailLoading, setGuardrailLoading] = useState(false);
  const [showGuardrailForm, setShowGuardrailForm] = useState(false);
  const [guardrailMap, setGuardrailMap] = useState({});

  useEffect(() => {
    loadCampaigns();
    loadGuardrails();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataService.getMetaAdsCampaigns();
      const campaignList = normalizeCampaigns(response);
      setCampaigns(campaignList);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load campaigns:', err);
      setError(err.message || t.campaigns.management.loadError);
    } finally {
      setLoading(false);
    }
  };

  const loadGuardrails = async () => {
    try {
      const response = await dataService.getGuardrails();
      const guardrails = normalizeCampaigns(response); // reuse normalization to extract arrays
      const map = {};
      guardrails.forEach((guardrail) => {
        if (guardrail?.campaignId) {
          map[guardrail.campaignId] = guardrail;
        }
      });
      setGuardrailMap(map);
    } catch (err) {
      console.warn('Failed to load guardrails:', err);
    }
  };

  const statusLabel = (status) => {
    const normalized = (status || '').toUpperCase();
    switch (normalized) {
      case 'ACTIVE':
        return t.marketing.active;
      case 'PAUSED':
        return t.marketing.paused;
      case 'COMPLETED':
        return t.marketing.completed;
      case 'ARCHIVED':
        return t.marketing.archived || 'Archived';
      default:
        return normalized || '—';
    }
  };

  const statusBadgeClass = (status) => {
    const normalized = (status || '').toUpperCase();
    return statusStyles[normalized] || statusStyles.UNKNOWN;
  };

  const handleActionSuccess = (message) => {
    if (message) {
      alert(message);
    }
    loadCampaigns();
  };

  const handleActionError = (message) => {
    if (message) {
      alert(message);
    }
  };

  const handleOpenHistory = (campaign) => {
    setHistoryCampaign(campaign);
  };

  const handleCloseHistory = () => {
    setHistoryCampaign(null);
    loadCampaigns();
  };

  const handleManageGuardrail = async (campaign) => {
    const campaignId = getCampaignId(campaign);
    if (!campaignId) {
      alert(t.campaigns.management.missingId);
      return;
    }

    setGuardrailCampaign(campaign);
    setGuardrailLoading(true);

    try {
      const response = await dataService.getGuardrails({ campaignId });
      const guardrails = normalizeCampaigns(response);
      const existing = guardrails.find((item) => item.campaignId === campaignId);
      setSelectedGuardrail(existing || guardrailMap[campaignId] || null);
    } catch (err) {
      console.warn('Failed to fetch guardrail for campaign:', err);
      setSelectedGuardrail(guardrailMap[campaignId] || null);
    } finally {
      setGuardrailLoading(false);
      setShowGuardrailForm(true);
    }
  };

  const handleGuardrailSuccess = (message) => {
    if (message) {
      alert(message);
    }
    setShowGuardrailForm(false);
    setSelectedGuardrail(null);
    setGuardrailCampaign(null);
    loadGuardrails();
  };

  const guardrailStatusLabel = (campaign) => {
    const campaignId = getCampaignId(campaign);
    const guardrail = guardrailMap[campaignId];
    if (!guardrail) {
      return t.campaigns.management.guardrailMissing;
    }

    if (guardrail.monitoring?.enabled) {
      return t.campaigns.management.guardrailActive;
    }

    return t.campaigns.management.guardrailPaused;
  };

  const lastSyncedLabel = useMemo(() => {
    if (!lastUpdated) return null;
    return translate('campaigns.management.lastUpdated', {
      time: formatRelativeTime(lastUpdated),
    });
  }, [lastUpdated, translate]);

  const currencyFor = (campaign) => campaign?.currency || 'USD';

  const isEmpty = !loading && campaigns.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t.campaigns.management.title}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {t.campaigns.management.subtitle}
          </p>
          {lastSyncedLabel && (
            <div className="mt-2 inline-flex items-center gap-2 text-xs text-gray-500">
              <FiClock className="h-3.5 w-3.5" />
              <span>{lastSyncedLabel}</span>
            </div>
          )}
        </div>
        <button
          onClick={loadCampaigns}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <FiRefreshCw className="h-4 w-4" />
          )}
          {t.campaigns.management.refresh}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && campaigns.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white">
          <LoadingSpinner size="lg" message={t.common.loading} />
        </div>
      ) : null}

      {isEmpty && (
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
          {t.campaigns.management.noCampaigns}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {campaigns.map((campaign) => {
          const campaignId = getCampaignId(campaign);
          const statusClass = statusBadgeClass(campaign?.status);
          const guardrailStatus = guardrailStatusLabel(campaign);

          const spend = campaign?.totalSpend ?? campaign?.spend ?? campaign?.lifetimeSpend;
          const dailyBudget = campaign?.dailyBudget ?? campaign?.budget?.daily;
          const impressions = campaign?.totalImpressions ?? campaign?.impressions;
          const clicks = campaign?.totalClicks ?? campaign?.clicks;
          const roas = campaign?.roas ?? campaign?.totalROAS ?? campaign?.avgROAS;

          return (
            <div
              key={campaignId || campaign?.name}
              className="flex h-full flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {campaign?.name || campaign?.campaignName || 'Untitled campaign'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {campaign?.objective || campaign?.adObjective || ''}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                  >
                    {statusLabel(campaign?.status)}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-500">
                      Spend
                    </dt>
                    <dd className="mt-1 text-base font-semibold text-gray-900">
                      {spend !== undefined
                        ? formatCurrency(Number(spend) || 0, currencyFor(campaign))
                        : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-500">
                      Daily budget
                    </dt>
                    <dd className="mt-1 text-base font-semibold text-gray-900">
                      {dailyBudget !== undefined
                        ? formatCurrency(Number(dailyBudget) || 0, currencyFor(campaign))
                        : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-500">
                      Impressions
                    </dt>
                    <dd className="mt-1 text-base font-semibold text-gray-900">
                      {impressions !== undefined ? formatNumber(Number(impressions) || 0, 1) : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-500">
                      Clicks
                    </dt>
                    <dd className="mt-1 text-base font-semibold text-gray-900">
                      {clicks !== undefined ? formatNumber(Number(clicks) || 0, 1) : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-500">
                      ROAS
                    </dt>
                    <dd className="mt-1 text-base font-semibold text-gray-900">
                      {roas !== undefined ? `${Number(roas).toFixed(2)}x` : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-gray-500">
                      ID
                    </dt>
                    <dd className="mt-1 text-base font-semibold text-gray-900">
                      {campaignId || '—'}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <FiShield className="h-4 w-4 text-blue-500" />
                  <span
                    className={
                      guardrailStatus === t.campaigns.management.guardrailMissing
                        ? 'text-gray-500'
                        : guardrailStatus === t.campaigns.management.guardrailPaused
                        ? 'text-yellow-600'
                        : 'text-blue-600'
                    }
                  >
                    {guardrailStatus}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <CampaignActions
                  campaign={campaign}
                  onSuccess={handleActionSuccess}
                  onError={handleActionError}
                />
                <button
                  onClick={() => handleOpenHistory(campaign)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {t.campaigns.management.viewHistory}
                </button>
                <button
                  onClick={() => handleManageGuardrail(campaign)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={guardrailLoading && guardrailCampaign === campaign}
                >
                  {guardrailLoading && guardrailCampaign === campaign ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <FiShield className="h-4 w-4" />
                  )}
                  {t.campaigns.management.manageGuardrail}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <CampaignHistory
        campaignId={getCampaignId(historyCampaign)}
        isOpen={Boolean(historyCampaign)}
        onClose={handleCloseHistory}
      />

      <GuardrailForm
        isOpen={showGuardrailForm}
        onClose={() => {
          setShowGuardrailForm(false);
          setGuardrailCampaign(null);
          setSelectedGuardrail(null);
        }}
        onSuccess={handleGuardrailSuccess}
        campaignId={getCampaignId(guardrailCampaign)}
        campaignName={
          guardrailCampaign?.name ||
          guardrailCampaign?.campaignName ||
          guardrailCampaign?.accountName ||
          ''
        }
        existingGuardrail={selectedGuardrail}
      />
    </div>
  );
};

export default CampaignManagement;
