import { useState, useEffect } from 'react';
import { FiX, FiSave, FiAlertCircle } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import { useLanguage } from '../../hooks/useLanguage';
import dataService from '../../services/dataService';

const GuardrailForm = ({ isOpen, onClose, onSuccess, campaignId, campaignName, existingGuardrail = null }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [guardrail, setGuardrail] = useState({
    rules: {
      minROAS: '',
      maxCPA: '',
      maxDailySpend: '',
      minCTR: '',
      maxCPC: '',
      minConversions: '',
    },
    autoActions: {
      autoPause: false,
      alertOnly: true,
      requireConfirmation: false,
    },
    monitoring: {
      enabled: true,
      evaluationWindow: 24,
      minDataPoints: 10,
    },
  });

  useEffect(() => {
    if (existingGuardrail) {
      setGuardrail({
        rules: existingGuardrail.rules || guardrail.rules,
        autoActions: existingGuardrail.autoActions || guardrail.autoActions,
        monitoring: existingGuardrail.monitoring || guardrail.monitoring,
      });
    }
  }, [existingGuardrail]);

  const handleRuleChange = (field, value) => {
    setGuardrail({
      ...guardrail,
      rules: {
        ...guardrail.rules,
        [field]: value === '' ? '' : parseFloat(value),
      },
    });
  };

  const handleAutoActionChange = (field, value) => {
    const newAutoActions = {
      ...guardrail.autoActions,
      [field]: value,
    };

    // If autoPause is enabled, disable alertOnly
    if (field === 'autoPause' && value) {
      newAutoActions.alertOnly = false;
    }

    // If alertOnly is enabled, disable autoPause
    if (field === 'alertOnly' && value) {
      newAutoActions.autoPause = false;
    }

    setGuardrail({
      ...guardrail,
      autoActions: newAutoActions,
    });
  };

  const handleMonitoringChange = (field, value) => {
    setGuardrail({
      ...guardrail,
      monitoring: {
        ...guardrail.monitoring,
        [field]: typeof value === 'boolean' ? value : parseFloat(value),
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        campaignId,
        campaignName,
        ...guardrail,
      };

      // Remove empty rules
      Object.keys(data.rules).forEach((key) => {
        if (data.rules[key] === '' || data.rules[key] === null) {
          delete data.rules[key];
        }
      });

      if (existingGuardrail) {
        await dataService.updateGuardrail(existingGuardrail._id, data);
      } else {
        await dataService.createGuardrail(data);
      }

      onSuccess?.(t.guardrails.form.saveSuccess);
      onClose();
    } catch (err) {
      setError(err.message || t.guardrails.form.saveError);
    } finally {
      setLoading(false);
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {existingGuardrail ? t.guardrails.form.editTitle : t.guardrails.form.createTitle}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-6 py-4">
            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>{t.guardrails.form.campaignLabel}:</strong> {campaignName}
              </p>
            </div>

            {/* Performance Thresholds */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                {t.guardrails.form.thresholdsTitle}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.guardrails.form.minROAS}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={guardrail.rules.minROAS}
                    onChange={(e) => handleRuleChange('minROAS', e.target.value)}
                    placeholder="e.g., 2.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.guardrails.form.maxCPA}
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={guardrail.rules.maxCPA}
                    onChange={(e) => handleRuleChange('maxCPA', e.target.value)}
                    placeholder="e.g., 50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.guardrails.form.maxDailySpend}
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={guardrail.rules.maxDailySpend}
                    onChange={(e) => handleRuleChange('maxDailySpend', e.target.value)}
                    placeholder="e.g., 500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.guardrails.form.minCTR}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={guardrail.rules.minCTR}
                    onChange={(e) => handleRuleChange('minCTR', e.target.value)}
                    placeholder="e.g., 1.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.guardrails.form.maxCPC}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={guardrail.rules.maxCPC}
                    onChange={(e) => handleRuleChange('maxCPC', e.target.value)}
                    placeholder="e.g., 5.0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.guardrails.form.minConversions}
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={guardrail.rules.minConversions}
                    onChange={(e) => handleRuleChange('minConversions', e.target.value)}
                    placeholder="e.g., 10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Auto-Actions */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                {t.guardrails.form.autoActionsTitle}
              </h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={guardrail.autoActions.autoPause}
                    onChange={(e) => handleAutoActionChange('autoPause', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {t.guardrails.form.autoPause}
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={guardrail.autoActions.alertOnly}
                    onChange={(e) => handleAutoActionChange('alertOnly', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {t.guardrails.form.alertOnly}
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={guardrail.autoActions.requireConfirmation}
                    onChange={(e) => handleAutoActionChange('requireConfirmation', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading || !guardrail.autoActions.autoPause}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {t.guardrails.form.requireConfirmation}
                  </span>
                </label>
              </div>
            </div>

            {/* Monitoring Settings */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                {t.guardrails.form.monitoringTitle}
              </h4>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={guardrail.monitoring.enabled}
                    onChange={(e) => handleMonitoringChange('enabled', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {t.guardrails.form.enableMonitoring}
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.guardrails.form.evaluationWindow}
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={guardrail.monitoring.evaluationWindow}
                      onChange={(e) => handleMonitoringChange('evaluationWindow', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.guardrails.form.minDataPoints}
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={guardrail.monitoring.minDataPoints}
                      onChange={(e) => handleMonitoringChange('minDataPoints', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    {t.guardrails.form.saving}
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4" />
                    {t.guardrails.form.save}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuardrailForm;
