import { useState } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import { useLanguage } from '../../hooks/useLanguage';

const MetaAdsManualTokenModal = ({ isOpen, onClose, onSubmit, loading, error }) => {
  const { t, translate } = useLanguage();
  const [accessToken, setAccessToken] = useState('');
  const [accountId, setAccountId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  // Calculate default expiration date (59 days from now)
  const getDefaultExpirationDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 59);
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  };

  const [expirationDate, setExpirationDate] = useState(getDefaultExpirationDate());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (accessToken && accountId) {
      // If expirationDate is provided, convert to ISO string with time, otherwise null
      const accessTokenExpiresAt = expirationDate
        ? new Date(expirationDate + 'T00:00:00.000Z').toISOString()
        : null;

      await onSubmit(accessToken, accountId, accountName, accessTokenExpiresAt);
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
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {t.integrations.metaAdsModal.title}
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

            {/* Help toggle */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
              >
                {showHelp
                  ? t.integrations.metaAdsModal.hideInstructions
                  : t.integrations.metaAdsModal.showInstructions}
              </button>
            </div>

            {/* Instructions */}
            {showHelp && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <h4 className="font-semibold text-blue-900 mb-2">
                  {t.integrations.metaAdsModal.instructionsTitle}
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-blue-800">
                  <li>{t.integrations.metaAdsModal.steps.step1}</li>
                  <li>{t.integrations.metaAdsModal.steps.step2}</li>
                  <li>{t.integrations.metaAdsModal.steps.step3}</li>
                  <li>{t.integrations.metaAdsModal.steps.step4}</li>
                  <li>{t.integrations.metaAdsModal.steps.step5}</li>
                  <li>{t.integrations.metaAdsModal.steps.step6}</li>
                </ol>
              </div>
            )}

            {/* Access Token Input */}
            <div className="mb-4">
              <label
                htmlFor="accessToken"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t.integrations.metaAdsModal.accessTokenLabel}{' '}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="accessToken"
                rows="3"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="EAAB..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                {t.integrations.metaAdsModal.accessTokenHelp}
              </p>
            </div>

            {/* Account ID Input */}
            <div className="mb-4">
              <label
                htmlFor="accountId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t.integrations.metaAdsModal.accountIdLabel}{' '}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="accountId"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder="act_123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                {t.integrations.metaAdsModal.accountIdHelp}
              </p>
            </div>

            {/* Account Name Input */}
            <div className="mb-6">
              <label
                htmlFor="accountName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t.integrations.metaAdsModal.accountNameLabel}
              </label>
              <input
                type="text"
                id="accountName"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Your Account Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                {t.integrations.metaAdsModal.accountNameHelp}
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 justify-end">
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
                disabled={loading || !accessToken || !accountId}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    {t.integrations.metaAdsModal.connecting}
                  </>
                ) : (
                  t.integrations.metaAdsModal.connect
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MetaAdsManualTokenModal;
