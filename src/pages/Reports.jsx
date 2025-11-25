import { useState, useEffect } from 'react';
import {
  FiMail,
  FiSend,
  FiEye,
  FiAlertCircle,
  FiCheckCircle,
  FiCalendar,
  FiUsers,
  FiFilter,
  FiRefreshCw
} from 'react-icons/fi';
import { useLanguage } from '../hooks/useLanguage';
import reportsService from '../services/reportsService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { REPORT_SECTION_OPTIONS } from '../utils/constants';

const Reports = () => {
  const { t } = useLanguage();

  // Email status
  const [emailStatus, setEmailStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);

  // Form state
  const [recipients, setRecipients] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sections, setSections] = useState(['marketing', 'finance', 'cross-analysis', 'forecasting', 'planning']);

  // UI state
  const [sending, setSending] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [sendingWeekly, setSendingWeekly] = useState(false);
  const [sendingMonthly, setSendingMonthly] = useState(false);
  const [message, setMessage] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    checkEmailStatus();
    initializeDateRange();
  }, []);

  const checkEmailStatus = async () => {
    try {
      setStatusLoading(true);
      const response = await reportsService.checkEmailStatus();
      setEmailStatus(response);
    } catch (error) {
      console.error('Error checking email status:', error);
      setEmailStatus({ configured: false, dummy: false });
    } finally {
      setStatusLoading(false);
    }
  };

  const initializeDateRange = () => {
    const { startDate, endDate } = reportsService.getDefaultDateRange('week');
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate recipients
    const emailList = recipients.split(',').map(e => e.trim()).filter(e => e);
    if (emailList.length === 0) {
      newErrors.recipients = t.reports.errors.noRecipients;
    } else {
      const invalidEmails = emailList.filter(email => !reportsService.validateEmail(email));
      if (invalidEmails.length > 0) {
        newErrors.recipients = `${t.reports.errors.invalidEmails}: ${invalidEmails.join(', ')}`;
      }
    }

    // Validate dates
    if (!startDate || !endDate) {
      newErrors.dates = t.reports.errors.datesRequired;
    } else {
      const dateValidation = reportsService.validateDateRange(startDate, endDate);
      if (!dateValidation.valid) {
        newErrors.dates = dateValidation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCustomReport = async () => {
    setMessage(null);
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      setSending(true);
      const emailList = recipients.split(',').map(e => e.trim()).filter(e => e);

      const data = {
        emails: emailList,
        startDate,
        endDate,
        sections
      };

      const response = await reportsService.sendCustomReport(data);
      setMessage({
        type: 'success',
        text: response.message || t.reports.messages.sendSuccess
      });

      // Clear recipients after successful send
      setRecipients('');
    } catch (error) {
      console.error('Error sending report:', error);
      setMessage({
        type: 'error',
        text: error.message || t.reports.messages.sendError
      });
    } finally {
      setSending(false);
    }
  };

  const handlePreviewReport = () => {
    const params = {
      startDate,
      endDate,
      sections
    };

    try {
      reportsService.openPreviewWindow(params);
    } catch (error) {
      console.error('Error opening preview:', error);
      setMessage({
        type: 'error',
        text: t.reports.messages.previewError
      });
    }
  };

  const toggleSection = (sectionValue) => {
    setSections(prev => {
      if (prev.includes(sectionValue)) {
        return prev.filter(s => s !== sectionValue);
      } else {
        return [...prev, sectionValue];
      }
    });
  };

  const selectAllSections = () => {
    setSections(REPORT_SECTION_OPTIONS.map(s => s.value));
  };

  const deselectAllSections = () => {
    setSections([]);
  };

  const handleSendWeeklyReport = async () => {
    setMessage(null);
    try {
      setSendingWeekly(true);
      const response = await reportsService.sendWeeklyReport();
      setMessage({
        type: 'success',
        text: response.message || t.reports.messages.weeklySuccess
      });
    } catch (error) {
      console.error('Error sending weekly report:', error);
      setMessage({
        type: 'error',
        text: error.message || t.reports.messages.weeklyError
      });
    } finally {
      setSendingWeekly(false);
    }
  };

  const handleSendMonthlyReport = async () => {
    setMessage(null);
    try {
      setSendingMonthly(true);
      const response = await reportsService.sendMonthlyReport();
      setMessage({
        type: 'success',
        text: response.message || t.reports.messages.monthlySuccess
      });
    } catch (error) {
      console.error('Error sending monthly report:', error);
      setMessage({
        type: 'error',
        text: error.message || t.reports.messages.monthlyError
      });
    } finally {
      setSendingMonthly(false);
    }
  };

  const handleTestEmail = async () => {
    setMessage(null);

    // Get user email from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const testEmail = user.email;

    if (!testEmail) {
      setMessage({
        type: 'error',
        text: t.reports.errors.noUserEmail
      });
      return;
    }

    try {
      setTestingEmail(true);
      const response = await reportsService.testEmail(testEmail);
      setMessage({
        type: 'success',
        text: response.message || t.reports.messages.testSuccess
      });
    } catch (error) {
      console.error('Error testing email:', error);
      setMessage({
        type: 'error',
        text: error.message || t.reports.messages.testError
      });
    } finally {
      setTestingEmail(false);
    }
  };

  const setDateRange = (period) => {
    const { startDate, endDate } = reportsService.getDefaultDateRange(period);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message={t.reports.loading} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Status Warning */}
      {emailStatus && !emailStatus.configured && (
        <div className="rounded-2xl border border-red-100 bg-red-50/80 p-4 flex items-start gap-3 shadow-[0_12px_30px_rgba(244,63,94,0.12)]">
          <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">{t.reports.emailNotConfigured}</h3>
            <p className="text-sm text-red-700">{t.reports.emailNotConfiguredDesc}</p>
          </div>
        </div>
      )}

      {/* Dummy Mode Warning */}
      {emailStatus && emailStatus.dummy && (
        <div className="rounded-2xl border border-amber-100 bg-amber-50/90 p-4 flex items-start gap-3 shadow-[0_12px_30px_rgba(251,191,36,0.15)]">
          <FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">{t.reports.dummyMode}</h3>
            <p className="text-sm text-amber-700">{t.reports.dummyModeDesc}</p>
          </div>
        </div>
      )}

      {/* Email Status Success */}
      {emailStatus && emailStatus.configured && !emailStatus.dummy && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/90 p-4 flex items-start gap-3 shadow-[0_12px_30px_rgba(16,185,129,0.14)]">
          <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-emerald-900 mb-1">{t.reports.emailConfigured}</h3>
            <p className="text-sm text-emerald-700">{emailStatus.message}</p>
          </div>
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div
          className={`rounded-2xl p-4 flex items-start gap-3 shadow-[0_12px_30px_rgba(15,23,42,0.08)] ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-100'
              : 'bg-red-50 border border-red-100'
          }`}
        >
          {message.type === 'success' ? (
            <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p className={message.type === 'success' ? 'text-emerald-700' : 'text-red-700'}>
            {message.text}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom Report Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-white border border-gray-200 shadow-[0_24px_50px_rgba(15,23,42,0.08)] p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiSend className="w-5 h-5 text-indigo-500" />
              {t.reports.customReport.title}
            </h2>

            <div className="space-y-5">
              {/* Recipients */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.reports.customReport.recipients}
                </label>
                <input
                  type="text"
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  placeholder={t.reports.customReport.recipientsPlaceholder}
                  className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ${
                    errors.recipients ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.recipients && (
                  <p className="mt-1 text-sm text-red-600">{errors.recipients}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">{t.reports.customReport.recipientsHint}</p>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t.reports.customReport.startDate}
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ${
                      errors.dates ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t.reports.customReport.endDate}
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 bg-white border rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ${
                      errors.dates ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                </div>
              </div>
              {errors.dates && (
                <p className="text-sm text-red-600">{errors.dates}</p>
              )}

              {/* Quick Date Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setDateRange('week')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {t.reports.customReport.lastWeek}
                </button>
                <button
                  onClick={() => setDateRange('month')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {t.reports.customReport.lastMonth}
                </button>
              </div>

              {/* Report Sections */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t.reports.customReport.sections}
                  </label>
                  <div className="flex gap-2 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={selectAllSections}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      {t.reports.customReport.selectAll}
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={deselectAllSections}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      {t.reports.customReport.deselectAll}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 border border-gray-200 rounded-2xl p-4 bg-gray-50/70">
                  {REPORT_SECTION_OPTIONS.map((section) => (
                    <div key={section.value} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id={`section-${section.value}`}
                        checked={sections.includes(section.value)}
                        onChange={() => toggleSection(section.value)}
                        className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor={`section-${section.value}`} className="flex-1 cursor-pointer">
                        <div className="text-sm font-semibold text-gray-900">{section.label}</div>
                        <div className="text-xs text-gray-500">{section.description}</div>
                      </label>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">{t.reports.customReport.sectionsHint}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={handleSendCustomReport}
                  disabled={sending || !emailStatus?.configured}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6b7bff] to-[#7f64ff] text-white rounded-full hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_12px_28px_rgba(107,123,255,0.35)]"
                >
                  {sending ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      {t.reports.customReport.sending}
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      {t.reports.customReport.send}
                    </>
                  )}
                </button>

                <button
                  onClick={handlePreviewReport}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-800 rounded-full hover:border-gray-300 transition-colors shadow-[0_10px_20px_rgba(15,23,42,0.06)]"
                >
                  <FiEye className="w-4 h-4" />
                  {t.reports.customReport.preview}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-3xl bg-white border border-gray-200 shadow-[0_20px_45px_rgba(15,23,42,0.08)] p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiUsers className="w-5 h-5 text-indigo-500" />
              {t.reports.quickActions.title}
            </h2>

            <div className="space-y-3">
              <button
                onClick={handleSendWeeklyReport}
                disabled={sendingWeekly || !emailStatus?.configured}
                className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white rounded-2xl hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_12px_26px_rgba(99,102,241,0.35)]"
              >
                {sendingWeekly ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                    {t.reports.quickActions.sending}
                  </>
                ) : (
                  <>
                    <FiCalendar className="w-4 h-4" />
                    {t.reports.quickActions.sendWeekly}
                  </>
                )}
              </button>

              <button
                onClick={handleSendMonthlyReport}
                disabled={sendingMonthly || !emailStatus?.configured}
                className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white rounded-2xl hover:brightness-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_12px_26px_rgba(139,92,246,0.32)]"
              >
                {sendingMonthly ? (
                  <>
                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                    {t.reports.quickActions.sending}
                  </>
                ) : (
                  <>
                    <FiCalendar className="w-4 h-4" />
                    {t.reports.quickActions.sendMonthly}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-2">
                {t.reports.quickActions.description}
              </p>
            </div>
          </div>

          {/* Test Email */}
          <div className="rounded-3xl bg-white border border-gray-200 shadow-[0_20px_45px_rgba(15,23,42,0.08)] p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiMail className="w-5 h-5 text-indigo-500" />
              {t.reports.testEmail.title}
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              {t.reports.testEmail.description}
            </p>

            <button
              onClick={handleTestEmail}
              disabled={testingEmail || !emailStatus?.configured}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-800 rounded-2xl hover:border-gray-300 transition-colors shadow-[0_10px_20px_rgba(15,23,42,0.06)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testingEmail ? (
                <>
                  <FiRefreshCw className="w-4 h-4 animate-spin" />
                  {t.reports.testEmail.sending}
                </>
              ) : (
                <>
                  <FiSend className="w-4 h-4" />
                  {t.reports.testEmail.send}
                </>
              )}
            </button>
          </div>

          {/* Email Status Card */}
          <div className="rounded-3xl bg-white border border-gray-200 shadow-[0_20px_45px_rgba(15,23,42,0.08)] p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              {t.reports.status.title}
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t.reports.status.configured}</span>
                <span className={`font-semibold ${emailStatus?.configured ? 'text-emerald-600' : 'text-red-600'}`}>
                  {emailStatus?.configured ? t.reports.status.yes : t.reports.status.no}
                </span>
              </div>

              {emailStatus?.configured && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t.reports.status.dummyMode}</span>
                  <span className={`font-semibold ${emailStatus.dummy ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {emailStatus.dummy ? t.reports.status.yes : t.reports.status.no}
                  </span>
                </div>
              )}

              <button
                onClick={checkEmailStatus}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 text-sm bg-white border border-gray-200 text-gray-800 rounded-2xl hover:border-gray-300 transition-colors shadow-[0_10px_20px_rgba(15,23,42,0.06)]"
              >
                <FiRefreshCw className="w-4 h-4" />
                {t.reports.status.refresh}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
