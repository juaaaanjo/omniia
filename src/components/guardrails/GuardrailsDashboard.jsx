import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import GuardrailForm from './GuardrailForm';
import { useLanguage } from '../../hooks/useLanguage';
import { formatCurrency } from '../../utils/formatters';
import dataService from '../../services/dataService';

const GuardrailsDashboard = () => {
  const { t } = useLanguage();
  const [guardrails, setGuardrails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedGuardrail, setSelectedGuardrail] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadGuardrails();
  }, []);

  const loadGuardrails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataService.getGuardrails({ status: 'active' });
      setGuardrails(response.data?.guardrails || []);
    } catch (err) {
      setError(err.message || 'Failed to load guardrails');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (campaign) => {
    setSelectedGuardrail(null);
    setSelectedCampaign(campaign);
    setShowForm(true);
  };

  const handleEdit = (guardrail) => {
    setSelectedGuardrail(guardrail);
    setSelectedCampaign({
      id: guardrail.campaignId,
      name: guardrail.campaignName,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.guardrails.dashboard.deleteConfirm)) {
      return;
    }

    setActionLoading(id);
    try {
      await dataService.deleteGuardrail(id);
      await loadGuardrails();
    } catch (err) {
      setError(err.message || 'Failed to delete guardrail');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggle = async (id) => {
    setActionLoading(id);
    try {
      await dataService.toggleGuardrail(id);
      await loadGuardrails();
    } catch (err) {
      setError(err.message || 'Failed to toggle guardrail');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCheck = async (id) => {
    setActionLoading(id);
    try {
      const response = await dataService.checkGuardrail(id);

      if (response.data?.status === 'violation') {
        alert(`${t.guardrails.dashboard.violationsDetected}: ${response.data.violations?.length || 0}`);
      } else {
        alert(t.guardrails.dashboard.performingWell);
      }
    } catch (err) {
      setError(err.message || 'Failed to check guardrail');
    } finally {
      setActionLoading(null);
    }
  };

  const handleFormSuccess = (message) => {
    alert(message);
    loadGuardrails();
  };

  if (loading && guardrails.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message={t.guardrails.dashboard.loading} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t.guardrails.dashboard.title}</h2>
          <p className="mt-1 text-sm text-gray-600">{t.guardrails.dashboard.subtitle}</p>
        </div>
        <button
          onClick={() => handleCreate(null)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="w-4 h-4" />
          {t.guardrails.dashboard.createNew}
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Guardrails List */}
      {guardrails.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-gray-500 mb-4">{t.guardrails.dashboard.noGuardrails}</p>
          <button
            onClick={() => handleCreate(null)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <FiPlus className="w-4 h-4" />
            {t.guardrails.dashboard.createFirst}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guardrails.map((guardrail) => (
            <div
              key={guardrail._id}
              className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {guardrail.campaignName}
                  </h3>
                  <div className="flex items-center gap-2">
                    {guardrail.monitoring?.enabled ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                        <FiCheckCircle className="w-3 h-3" />
                        {t.guardrails.dashboard.active}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {t.guardrails.dashboard.paused}
                      </span>
                    )}
                    {guardrail.violationCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded">
                        <FiAlertTriangle className="w-3 h-3" />
                        {guardrail.violationCount} {t.guardrails.dashboard.violations}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Rules */}
              <div className="mb-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  {t.guardrails.dashboard.rulesTitle}
                </h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {guardrail.rules?.minROAS && (
                    <div className="flex justify-between">
                      <span>{t.guardrails.dashboard.minROAS}:</span>
                      <span className="font-medium">{guardrail.rules.minROAS.toFixed(1)}</span>
                    </div>
                  )}
                  {guardrail.rules?.maxCPA && (
                    <div className="flex justify-between">
                      <span>{t.guardrails.dashboard.maxCPA}:</span>
                      <span className="font-medium">{formatCurrency(guardrail.rules.maxCPA)}</span>
                    </div>
                  )}
                  {guardrail.rules?.maxDailySpend && (
                    <div className="flex justify-between">
                      <span>{t.guardrails.dashboard.maxDailySpend}:</span>
                      <span className="font-medium">{formatCurrency(guardrail.rules.maxDailySpend)}</span>
                    </div>
                  )}
                  {guardrail.rules?.minCTR && (
                    <div className="flex justify-between">
                      <span>{t.guardrails.dashboard.minCTR}:</span>
                      <span className="font-medium">{guardrail.rules.minCTR.toFixed(2)}%</span>
                    </div>
                  )}
                  {guardrail.rules?.maxCPC && (
                    <div className="flex justify-between">
                      <span>{t.guardrails.dashboard.maxCPC}:</span>
                      <span className="font-medium">{formatCurrency(guardrail.rules.maxCPC)}</span>
                    </div>
                  )}
                  {guardrail.rules?.minConversions && (
                    <div className="flex justify-between">
                      <span>{t.guardrails.dashboard.minConversions}:</span>
                      <span className="font-medium">{guardrail.rules.minConversions}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Auto-Actions */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  {guardrail.autoActions?.autoPause ? (
                    <span className="text-orange-600">
                      {t.guardrails.dashboard.autoPauseEnabled}
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      {t.guardrails.dashboard.alertOnlyMode}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggle(guardrail._id)}
                  disabled={actionLoading === guardrail._id}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  title={guardrail.monitoring?.enabled ? t.guardrails.dashboard.disable : t.guardrails.dashboard.enable}
                >
                  {actionLoading === guardrail._id ? (
                    <LoadingSpinner size="sm" />
                  ) : guardrail.monitoring?.enabled ? (
                    <FiToggleRight className="w-4 h-4" />
                  ) : (
                    <FiToggleLeft className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => handleCheck(guardrail._id)}
                  disabled={actionLoading === guardrail._id}
                  className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {t.guardrails.dashboard.checkNow}
                </button>

                <button
                  onClick={() => handleEdit(guardrail)}
                  disabled={actionLoading === guardrail._id}
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 focus:outline-none disabled:opacity-50"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(guardrail._id)}
                  disabled={actionLoading === guardrail._id}
                  className="px-3 py-2 text-gray-700 hover:text-red-600 focus:outline-none disabled:opacity-50"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Guardrail Form Modal */}
      <GuardrailForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedGuardrail(null);
          setSelectedCampaign(null);
        }}
        onSuccess={handleFormSuccess}
        campaignId={selectedCampaign?.id}
        campaignName={selectedCampaign?.name}
        existingGuardrail={selectedGuardrail}
      />
    </div>
  );
};

export default GuardrailsDashboard;
