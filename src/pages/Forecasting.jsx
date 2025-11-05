import { useState, useEffect } from 'react';
import {
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiTarget,
  FiZap,
  FiBarChart2,
  FiAlertCircle
} from 'react-icons/fi';
import { useLanguage } from '../hooks/useLanguage';
import dataService from '../services/dataService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import '../styles/markdown.css';

const Forecasting = () => {
  const { t, translate } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [quickForecast, setQuickForecast] = useState(null);
  const [customForecast, setCustomForecast] = useState(null);
  const [scenarios, setScenarios] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('quick'); // quick, custom, scenarios

  // Form state for custom forecast
  const [formData, setFormData] = useState({
    forecastType: 'revenue',
    forecastPeriod: 'next_month',
    customDays: 30,
    includeSeasonality: true,
    confidenceLevel: 0.8,
  });

  // Form state for scenarios
  const [scenarioData, setScenarioData] = useState({
    forecastType: 'revenue',
    forecastPeriod: 'next_month',
  });

  // Forecast type options
  const forecastTypes = [
    { value: 'revenue', label: t.forecasting.forecastTypes.revenue, icon: FiDollarSign },
    { value: 'ad_spend', label: t.forecasting.forecastTypes.adSpend, icon: FiTarget },
    { value: 'customer_growth', label: t.forecasting.forecastTypes.customerGrowth, icon: FiUsers },
    { value: 'roas', label: t.forecasting.forecastTypes.roas, icon: FiTrendingUp },
    { value: 'comprehensive', label: t.forecasting.forecastTypes.comprehensive, icon: FiBarChart2 },
  ];

  const forecastPeriods = [
    { value: 'next_week', label: t.forecasting.periods.nextWeek },
    { value: 'next_month', label: t.forecasting.periods.nextMonth },
    { value: 'next_quarter', label: t.forecasting.periods.nextQuarter },
    { value: 'custom', label: t.forecasting.periods.custom },
  ];

  // Load quick forecast on mount
  useEffect(() => {
    loadQuickForecast();
  }, []);

  const loadQuickForecast = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dataService.getQuickForecast();
      setQuickForecast(data);
    } catch (err) {
      console.error('Failed to load quick forecast:', err);
      setError(err.message || t.forecasting.errors.loadFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCustomForecast = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const data = await dataService.generateForecast(formData);
      setCustomForecast(data);
    } catch (err) {
      console.error('Failed to generate forecast:', err);
      setError(err.message || t.forecasting.errors.generateFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScenarios = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const data = await dataService.generateScenarios(scenarioData);
      setScenarios(data);
    } catch (err) {
      console.error('Failed to generate scenarios:', err);
      setError(err.message || t.forecasting.errors.generateFailed);
    } finally {
      setLoading(false);
    }
  };

  const renderQuickForecast = () => {
    if (loading && !quickForecast) {
      return (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" message={t.common.loading} />
        </div>
      );
    }

    if (!quickForecast) return null;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <FiZap className="w-8 h-8" />
            <h2 className="text-2xl font-bold">{t.forecasting.quick.title}</h2>
          </div>
          <p className="text-blue-100 mb-6">{t.forecasting.quick.subtitle}</p>

          {quickForecast.prediction && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-4xl font-bold mb-2">
                {formatCurrency(quickForecast.prediction.value || 0)}
              </div>
              <div className="text-sm text-blue-100">
                {t.forecasting.results.confidence}: {((quickForecast.prediction.confidence || 0.8) * 100).toFixed(0)}%
              </div>
            </div>
          )}
        </div>

        {quickForecast.analysis && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.forecasting.results.analysis}</h3>
            <div className="prose prose-sm max-w-none text-gray-700 markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="ml-2">{children}</li>,
                  code: ({ inline, children }) =>
                    inline ? (
                      <code className="px-1.5 py-0.5 bg-gray-100 text-primary-600 rounded text-xs font-mono">
                        {children}
                      </code>
                    ) : (
                      <code className="block p-3 bg-gray-100 rounded-lg text-xs font-mono overflow-x-auto mb-3">
                        {children}
                      </code>
                    ),
                  pre: ({ children }) => <pre className="mb-3">{children}</pre>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-2">{children}</h3>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-300 pl-3 py-1 my-3 text-gray-600 italic">
                      {children}
                    </blockquote>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {quickForecast.analysis}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {quickForecast.insights && quickForecast.insights.length > 0 && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.forecasting.results.insights}</h3>
            <ul className="space-y-2">
              {quickForecast.insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <FiTrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderCustomForecast = () => {
    return (
      <div className="space-y-6">
        <form onSubmit={handleGenerateCustomForecast} className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t.forecasting.customForecast}</h2>

          <div className="space-y-4">
            {/* Forecast Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.forecasting.form.forecastType}
              </label>
              <select
                value={formData.forecastType}
                onChange={(e) => setFormData({ ...formData, forecastType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {forecastTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Forecast Period */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.forecasting.form.forecastPeriod}
              </label>
              <select
                value={formData.forecastPeriod}
                onChange={(e) => setFormData({ ...formData, forecastPeriod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {forecastPeriods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Days (only show if custom period selected) */}
            {formData.forecastPeriod === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.forecasting.form.customDays}
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={formData.customDays}
                  onChange={(e) => setFormData({ ...formData, customDays: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Include Seasonality */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeSeasonality"
                checked={formData.includeSeasonality}
                onChange={(e) => setFormData({ ...formData, includeSeasonality: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="includeSeasonality" className="text-sm font-medium text-gray-700">
                {t.forecasting.form.includeSeasonality}
              </label>
            </div>

            {/* Confidence Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.forecasting.form.confidenceLevel}: {(formData.confidenceLevel * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.2"
                max="0.95"
                step="0.05"
                value={formData.confidenceLevel}
                onChange={(e) => setFormData({ ...formData, confidenceLevel: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>20%</span>
                <span>95%</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                {t.forecasting.generating}
              </>
            ) : (
              <>
                <FiBarChart2 className="w-5 h-5" />
                {t.forecasting.generateForecast}
              </>
            )}
          </button>
        </form>

        {customForecast && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.forecasting.results.prediction}</h3>

              {customForecast.prediction && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900 mb-2">
                    {formatCurrency(customForecast.prediction.value || 0)}
                  </div>
                  {customForecast.prediction.range && (
                    <div className="text-sm text-blue-700">
                      {t.forecasting.results.range}: {formatCurrency(customForecast.prediction.range.min || 0)} - {formatCurrency(customForecast.prediction.range.max || 0)}
                    </div>
                  )}
                </div>
              )}

              {customForecast.analysis && (
                <div className="prose prose-sm max-w-none text-gray-700 markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="ml-2">{children}</li>,
                      code: ({ inline, children }) =>
                        inline ? (
                          <code className="px-1.5 py-0.5 bg-gray-100 text-primary-600 rounded text-xs font-mono">
                            {children}
                          </code>
                        ) : (
                          <code className="block p-3 bg-gray-100 rounded-lg text-xs font-mono overflow-x-auto mb-3">
                            {children}
                          </code>
                        ),
                      pre: ({ children }) => <pre className="mb-3">{children}</pre>,
                      h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-2">{children}</h3>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-300 pl-3 py-1 my-3 text-gray-600 italic">
                          {children}
                        </blockquote>
                      ),
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 underline"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {customForecast.analysis}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {customForecast.recommendations && customForecast.recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.forecasting.results.recommendations}</h3>
                <ul className="space-y-3">
                  {customForecast.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <FiTarget className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderScenarios = () => {
    return (
      <div className="space-y-6">
        <form onSubmit={handleGenerateScenarios} className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t.forecasting.scenarioAnalysis.title}</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.forecasting.form.forecastType}
              </label>
              <select
                value={scenarioData.forecastType}
                onChange={(e) => setScenarioData({ ...scenarioData, forecastType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {forecastTypes.filter(t => t.value !== 'comprehensive').map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.forecasting.form.forecastPeriod}
              </label>
              <select
                value={scenarioData.forecastPeriod}
                onChange={(e) => setScenarioData({ ...scenarioData, forecastPeriod: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {forecastPeriods.filter(p => p.value !== 'custom').map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                {t.forecasting.generating}
              </>
            ) : (
              <>
                <FiTrendingUp className="w-5 h-5" />
                {t.forecasting.generateForecast}
              </>
            )}
          </button>
        </form>

        {scenarios && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Best Case */}
            {scenarios.bestCase && (
              <div className="bg-white rounded-lg shadow border border-green-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiTrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{t.forecasting.scenarioAnalysis.bestCase}</h3>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {formatCurrency(scenarios.bestCase.value || 0)}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {scenarios.bestCase.description || t.forecasting.scenarioAnalysis.bestCase}
                </p>
                {scenarios.bestCase.probability && (
                  <div className="text-xs text-gray-500">
                    {t.forecasting.scenarioAnalysis.probability}: {(scenarios.bestCase.probability * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            )}

            {/* Most Likely */}
            {scenarios.mostLikely && (
              <div className="bg-white rounded-lg shadow border border-blue-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiBarChart2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{t.forecasting.scenarioAnalysis.mostLikely}</h3>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {formatCurrency(scenarios.mostLikely.value || 0)}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {scenarios.mostLikely.description || t.forecasting.scenarioAnalysis.mostLikely}
                </p>
                {scenarios.mostLikely.probability && (
                  <div className="text-xs text-gray-500">
                    {t.forecasting.scenarioAnalysis.probability}: {(scenarios.mostLikely.probability * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            )}

            {/* Worst Case */}
            {scenarios.worstCase && (
              <div className="bg-white rounded-lg shadow border border-red-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <FiAlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{t.forecasting.scenarioAnalysis.worstCase}</h3>
                </div>
                <div className="text-2xl font-bold text-red-600 mb-2">
                  {formatCurrency(scenarios.worstCase.value || 0)}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {scenarios.worstCase.description || t.forecasting.scenarioAnalysis.worstCase}
                </p>
                {scenarios.worstCase.probability && (
                  <div className="text-xs text-gray-500">
                    {t.forecasting.scenarioAnalysis.probability}: {(scenarios.worstCase.probability * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {scenarios && scenarios.analysis && (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.forecasting.scenarioAnalysis.title}</h3>
            <div className="prose prose-sm max-w-none text-gray-700 markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                  strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="ml-2">{children}</li>,
                  code: ({ inline, children }) =>
                    inline ? (
                      <code className="px-1.5 py-0.5 bg-gray-100 text-primary-600 rounded text-xs font-mono">
                        {children}
                      </code>
                    ) : (
                      <code className="block p-3 bg-gray-100 rounded-lg text-xs font-mono overflow-x-auto mb-3">
                        {children}
                      </code>
                    ),
                  pre: ({ children }) => <pre className="mb-3">{children}</pre>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-2">{children}</h3>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-300 pl-3 py-1 my-3 text-gray-600 italic">
                      {children}
                    </blockquote>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {scenarios.analysis}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t.forecasting.title}</h1>
        <p className="mt-2 text-gray-600">
          {t.forecasting.subtitle}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-2">
          <FiAlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'quick'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <FiZap className="w-4 h-4" />
            {t.forecasting.quickForecast}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'custom'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <FiBarChart2 className="w-4 h-4" />
            {t.forecasting.customForecast}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('scenarios')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'scenarios'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <FiTrendingUp className="w-4 h-4" />
            {t.forecasting.scenarios}
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'quick' && renderQuickForecast()}
        {activeTab === 'custom' && renderCustomForecast()}
        {activeTab === 'scenarios' && renderScenarios()}
      </div>
    </div>
  );
};

export default Forecasting;
