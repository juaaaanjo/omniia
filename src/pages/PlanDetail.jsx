import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiCheck,
  FiX,
  FiEdit,
  FiTrash2,
  FiClock,
  FiTarget,
  FiTrendingUp,
  FiDollarSign,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiBarChart
} from 'react-icons/fi';
import { useLanguage } from '../hooks/useLanguage';
import { ROUTES } from '../utils/constants';
import planningService from '../services/planningService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';

const PlanDetail = () => {
  const { planId } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [resultsData, setResultsData] = useState({
    revenue: '',
    customers: '',
    adSpend: '',
    roas: '',
    notes: '',
  });
  const [recordingResults, setRecordingResults] = useState(false);
  const [recordSuccess, setRecordSuccess] = useState(false);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    fetchPlanDetail();
  }, [planId]);

  const fetchPlanDetail = async () => {
    try {
      setLoading(true);
      const response = await planningService.getPlanById(planId);
      setPlan(response);

      // Fetch performance metrics if plan is completed
      if (response.status === 'completed') {
        try {
          const perfData = await planningService.getPlanPerformance(planId);
          setPerformance(perfData);
        } catch (err) {
          console.error('Error fetching performance:', err);
        }
      }
    } catch (error) {
      console.error('Error fetching plan details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResultsModal = () => {
    // Pre-fill with baseline or existing results
    if (plan.baseline) {
      setResultsData({
        revenue: plan.baseline.revenue || '',
        customers: plan.baseline.customers || '',
        adSpend: plan.baseline.adSpend || '',
        roas: plan.baseline.roas || '',
        notes: '',
      });
    }
    setRecordSuccess(false);
    setShowResultsModal(true);
  };

  const handleCloseResultsModal = () => {
    setShowResultsModal(false);
    setResultsData({
      revenue: '',
      customers: '',
      adSpend: '',
      roas: '',
      notes: '',
    });
    setRecordSuccess(false);
  };

  const handleRecordResults = async (e) => {
    e.preventDefault();

    try {
      setRecordingResults(true);

      // Build actualMetrics object from form data
      const actualMetrics = {};
      if (resultsData.revenue) actualMetrics.revenue = parseFloat(resultsData.revenue);
      if (resultsData.customers) actualMetrics.customers = parseFloat(resultsData.customers);
      if (resultsData.adSpend) actualMetrics.adSpend = parseFloat(resultsData.adSpend);
      if (resultsData.roas) actualMetrics.roas = parseFloat(resultsData.roas);

      await planningService.recordPlanResults(
        planId,
        actualMetrics,
        resultsData.notes
      );

      setRecordSuccess(true);

      // Reload plan and performance data after 2 seconds
      setTimeout(async () => {
        await fetchPlanDetail();
        handleCloseResultsModal();
      }, 2000);
    } catch (error) {
      console.error('Error recording results:', error);
    } finally {
      setRecordingResults(false);
    }
  };

  const handleAcceptPlan = async () => {
    try {
      await planningService.acceptPlan(planId);
      await fetchPlanDetail();
    } catch (error) {
      console.error('Error accepting plan:', error);
    }
  };

  const handleRejectPlan = async () => {
    try {
      await planningService.rejectPlan(planId);
      navigate(ROUTES.PLANNING);
    } catch (error) {
      console.error('Error rejecting plan:', error);
    }
  };

  const handleUpdateActionItem = async (actionId, updates) => {
    try {
      await planningService.updateActionItem(planId, actionId, updates);
      await fetchPlanDetail();
    } catch (error) {
      console.error('Error updating action item:', error);
    }
  };

  const handleUpdateMilestone = async (milestoneId, updates) => {
    try {
      await planningService.updateMilestone(planId, milestoneId, updates);
      await fetchPlanDetail();
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: 'bg-gray-100 text-gray-700',
      active: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      archived: 'bg-gray-100 text-gray-500',
    };
    return badges[status] || badges.draft;
  };

  const getTypeBadge = (planType) => {
    const badges = {
      revenue_growth: 'bg-green-100 text-green-700',
      marketing_budget: 'bg-blue-100 text-blue-700',
      customer_acquisition: 'bg-purple-100 text-purple-700',
      roas_optimization: 'bg-yellow-100 text-yellow-700',
      comprehensive: 'bg-indigo-100 text-indigo-700',
    };
    return badges[planType] || badges.comprehensive;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    };
    return badges[priority] || badges.medium;
  };

  const getActionStatusBadge = (status) => {
    const badges = {
      pending: 'bg-gray-100 text-gray-700',
      in_progress: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return badges[status] || badges.pending;
  };

  const getMilestoneStatusBadge = (status) => {
    const badges = {
      pending: 'bg-gray-100 text-gray-700',
      on_track: 'bg-blue-100 text-blue-700',
      at_risk: 'bg-yellow-100 text-yellow-700',
      achieved: 'bg-green-100 text-green-700',
      missed: 'bg-red-100 text-red-700',
    };
    return badges[status] || badges.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message={t.planning.messages.loading} />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Plan not found</h2>
        <button
          onClick={() => navigate(ROUTES.PLANNING)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {t.planning.detail.overview}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate(ROUTES.PLANNING)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mt-1"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{plan.planName}</h1>
            <p className="text-gray-600 mb-3">{plan.description}</p>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeBadge(plan.planType)}`}>
                {t.planning.planTypes[plan.planType] || plan.planType}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(plan.status)}`}>
                {t.planning.status[plan.status] || plan.status}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center gap-1">
                <FiCalendar className="w-4 h-4" />
                {new Date(plan.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {plan.status === 'draft' && (
            <>
              <button
                onClick={handleAcceptPlan}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiCheck className="w-4 h-4" />
                {t.planning.acceptPlan}
              </button>
              <button
                onClick={handleRejectPlan}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FiX className="w-4 h-4" />
                {t.planning.rejectPlan}
              </button>
            </>
          )}
          {(plan.status === 'active' || plan.status === 'completed') && (
            <button
              onClick={handleOpenResultsModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiBarChart className="w-4 h-4" />
              {t.planning.results.record}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {plan.status === 'active' && plan.progress && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-semibold text-gray-900">{t.planning.detail.progress}</span>
            <span className="text-2xl font-bold text-primary-600">{plan.progress.overall}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-primary-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${plan.progress.overall}%` }}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'overview', label: t.planning.detail.overview, icon: FiTarget },
              { id: 'strategy', label: t.planning.detail.strategy, icon: FiTrendingUp },
              { id: 'budget', label: t.planning.detail.budget, icon: FiDollarSign },
              { id: 'actions', label: t.planning.detail.actions, icon: FiCheck },
              { id: 'milestones', label: t.planning.detail.milestones, icon: FiClock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Goals */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.planning.form.primaryGoal}</h3>
                {plan.goals?.primary && (
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{plan.goals.primary.metric}</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {formatCurrency(plan.goals.primary.target)} {plan.goals.primary.unit}
                        </p>
                        {plan.goals.primary.description && (
                          <p className="text-sm text-gray-600 mt-2">{plan.goals.primary.description}</p>
                        )}
                      </div>
                      <FiTarget className="w-12 h-12 text-primary-600" />
                    </div>
                  </div>
                )}
              </div>

              {/* Secondary Goals */}
              {plan.goals?.secondary && plan.goals.secondary.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.planning.form.secondaryGoals}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plan.goals.secondary.map((goal, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">{goal.metric}</p>
                        <p className="text-xl font-semibold text-gray-900">
                          {formatCurrency(goal.target)} {goal.unit}
                        </p>
                        {goal.description && (
                          <p className="text-sm text-gray-600 mt-2">{goal.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Baseline Metrics */}
              {plan.baseline && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Baseline (Starting Point)</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {plan.baseline.revenue !== undefined && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Revenue</p>
                          <p className="text-lg font-semibold text-gray-900">{formatCurrency(plan.baseline.revenue)}</p>
                        </div>
                      )}
                      {plan.baseline.customers !== undefined && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Customers</p>
                          <p className="text-lg font-semibold text-gray-900">{plan.baseline.customers}</p>
                        </div>
                      )}
                      {plan.baseline.adSpend !== undefined && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Ad Spend</p>
                          <p className="text-lg font-semibold text-gray-900">{formatCurrency(plan.baseline.adSpend)}</p>
                        </div>
                      )}
                      {plan.baseline.roas !== undefined && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">ROAS</p>
                          <p className="text-lg font-semibold text-gray-900">{plan.baseline.roas.toFixed(2)}x</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Metrics */}
              {performance && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.planning.results.performance}</h3>

                  {/* Overall Performance */}
                  {performance.goalAchievement !== undefined && (
                    <div className={`rounded-lg p-6 border-2 mb-4 ${
                      performance.goalAchievement >= 100
                        ? 'bg-green-50 border-green-300'
                        : performance.goalAchievement >= 80
                        ? 'bg-yellow-50 border-yellow-300'
                        : 'bg-red-50 border-red-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">{t.planning.results.goalAchievement}</p>
                          <p className={`text-4xl font-bold ${
                            performance.goalAchievement >= 100
                              ? 'text-green-700'
                              : performance.goalAchievement >= 80
                              ? 'text-yellow-700'
                              : 'text-red-700'
                          }`}>
                            {performance.goalAchievement.toFixed(1)}%
                          </p>
                        </div>
                        {performance.goalAchievement >= 100 ? (
                          <div className="text-center">
                            <FiCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-green-700">{t.planning.results.goalExceeded}</p>
                          </div>
                        ) : performance.goalAchievement < 80 ? (
                          <div className="text-center">
                            <FiAlertCircle className="w-12 h-12 text-red-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-red-700">{t.planning.results.goalMissed}</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}

                  {/* Metrics Comparison */}
                  {performance.metrics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(performance.metrics).map(([key, data]) => (
                        <div key={key} className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="text-xs text-gray-500 mb-2 capitalize">{key}</p>
                          <div className="space-y-2">
                            {data.baseline !== undefined && (
                              <div>
                                <p className="text-xs text-gray-600">{t.planning.results.baseline}</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {key === 'revenue' || key === 'adSpend'
                                    ? formatCurrency(data.baseline)
                                    : key === 'roas'
                                    ? `${data.baseline.toFixed(2)}x`
                                    : data.baseline}
                                </p>
                              </div>
                            )}
                            {data.actual !== undefined && (
                              <div>
                                <p className="text-xs text-gray-600">{t.planning.results.actual}</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {key === 'revenue' || key === 'adSpend'
                                    ? formatCurrency(data.actual)
                                    : key === 'roas'
                                    ? `${data.actual.toFixed(2)}x`
                                    : data.actual}
                                </p>
                              </div>
                            )}
                            {data.variance !== undefined && (
                              <div className="pt-2 border-t border-gray-200">
                                <p className="text-xs text-gray-600">{t.planning.results.variance}</p>
                                <p className={`text-sm font-bold ${
                                  data.variance >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {data.variance >= 0 ? '+' : ''}{data.variance.toFixed(1)}%
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.planning.detail.duration}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">{t.planning.detail.startDate}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {plan.startDate ? new Date(plan.startDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">{t.planning.detail.endDate}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">{t.planning.form.planPeriod}</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {t.planning.periods[plan.planPeriod] || plan.planPeriod}
                    </p>
                  </div>
                </div>
              </div>

              {/* KPIs */}
              {plan.kpis && plan.kpis.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.planning.kpis.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plan.kpis.map((kpi, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{kpi.name}</h4>
                          <span className="text-sm text-gray-500">
                            {t.planning.kpis[kpi.trackingFrequency] || kpi.trackingFrequency}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{t.planning.kpis.target}:</span>
                            <span className="font-medium text-gray-900">{formatCurrency(kpi.target)}</span>
                          </div>
                          {kpi.current !== undefined && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">{t.planning.kpis.current}:</span>
                              <span className="font-medium text-gray-900">{formatCurrency(kpi.current)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Strategy Tab */}
          {activeTab === 'strategy' && (
            <div className="space-y-6">
              {plan.strategy?.summary && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.planning.strategy.summary}</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{plan.strategy.summary}</p>
                </div>
              )}

              {plan.strategy?.analysis && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.planning.strategy.analysis}</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{plan.strategy.analysis}</p>
                </div>
              )}

              {plan.strategy?.keyInsights && plan.strategy.keyInsights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.planning.strategy.keyInsights}</h3>
                  <ul className="space-y-2">
                    {plan.strategy.keyInsights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <FiCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {plan.strategy?.risks && plan.strategy.risks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.planning.strategy.risks}</h3>
                  <ul className="space-y-2">
                    {plan.strategy.risks.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <FiAlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {plan.strategy?.opportunities && plan.strategy.opportunities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{t.planning.strategy.opportunities}</h3>
                  <ul className="space-y-2">
                    {plan.strategy.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <FiTrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {plan.reasoning && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">{t.planning.whyThisPlan}</h3>
                  <p className="text-blue-800 whitespace-pre-wrap">{plan.reasoning}</p>
                </div>
              )}
            </div>
          )}

          {/* Budget Tab */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              {plan.budget?.total && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">{t.planning.detail.totalBudget}</p>
                  <p className="text-4xl font-bold text-gray-900">{formatCurrency(plan.budget.total)}</p>
                </div>
              )}

              {plan.budget?.allocation && plan.budget.allocation.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.planning.budget.allocation}</h3>
                  <div className="space-y-4">
                    {plan.budget.allocation.map((item, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{item.channel}</h4>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{formatCurrency(item.amount)}</p>
                            <p className="text-sm text-gray-500">{item.percentage}%</p>
                          </div>
                        </div>
                        {item.expectedReturn && (
                          <div className="text-sm text-gray-600 mb-2">
                            {t.planning.budget.expectedReturn}: {formatCurrency(item.expectedReturn)}
                          </div>
                        )}
                        {item.rationale && (
                          <p className="text-sm text-gray-600">{item.rationale}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{t.planning.actions.title}</h3>
              </div>

              {plan.actionItems && plan.actionItems.length > 0 ? (
                <div className="space-y-4">
                  {plan.actionItems.map((action) => (
                    <div key={action._id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{action.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(action.priority)}`}>
                              {t.planning.priority[action.priority] || action.priority}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionStatusBadge(action.status)}`}>
                              {t.planning.actions[action.status] || action.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                          {action.estimatedImpact && (
                            <div className="mb-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm font-medium text-green-800">
                                <span className="font-semibold">{t.planning.actions.estimatedImpact}:</span> {action.estimatedImpact}
                              </p>
                            </div>
                          )}
                          {action.deadline && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <FiCalendar className="w-4 h-4" />
                              {new Date(action.deadline).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {action.status !== 'completed' && action.status !== 'cancelled' && (
                            <>
                              {action.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateActionItem(action._id, { status: 'in_progress' })}
                                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                  {t.planning.actions.markInProgress}
                                </button>
                              )}
                              {action.status === 'in_progress' && (
                                <button
                                  onClick={() => handleUpdateActionItem(action._id, { status: 'completed' })}
                                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                  {t.planning.actions.markComplete}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No action items available
                </div>
              )}
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.planning.milestones.title}</h3>

              {plan.milestones && plan.milestones.length > 0 ? (
                <div className="space-y-4">
                  {plan.milestones.map((milestone) => (
                    <div key={milestone._id} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{milestone.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMilestoneStatusBadge(milestone.status)}`}>
                              {t.planning.milestones[milestone.status] || milestone.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">{t.planning.milestones.targetDate}:</p>
                              <p className="font-medium text-gray-900">
                                {new Date(milestone.targetDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">{t.planning.milestones.metric}:</p>
                              <p className="font-medium text-gray-900">{milestone.metric}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">{t.planning.milestones.targetValue}:</p>
                              <p className="font-medium text-gray-900">{formatCurrency(milestone.targetValue)}</p>
                            </div>
                            {milestone.actualValue !== undefined && (
                              <div>
                                <p className="text-gray-600">{t.planning.milestones.actualValue}:</p>
                                <p className="font-medium text-gray-900">{formatCurrency(milestone.actualValue)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No milestones available
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Record Results Modal */}
      {showResultsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-xl font-semibold text-gray-900">
                {t.planning.results.record}
              </h3>
              <button
                onClick={handleCloseResultsModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {recordSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <FiCheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {t.planning.results.recordSuccess}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {t.planning.results.aiWillLearn}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRecordResults} className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    {t.planning.results.description}
                  </p>

                  {/* Show baseline for comparison */}
                  {plan.baseline && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
                      <p className="text-sm text-blue-700 mb-2 font-medium">
                        {t.planning.results.baseline}:
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {plan.baseline.revenue !== undefined && (
                          <div>
                            <span className="text-blue-600">Revenue:</span>{' '}
                            <span className="font-semibold text-blue-900">
                              {formatCurrency(plan.baseline.revenue)}
                            </span>
                          </div>
                        )}
                        {plan.baseline.customers !== undefined && (
                          <div>
                            <span className="text-blue-600">Customers:</span>{' '}
                            <span className="font-semibold text-blue-900">
                              {plan.baseline.customers}
                            </span>
                          </div>
                        )}
                        {plan.baseline.adSpend !== undefined && (
                          <div>
                            <span className="text-blue-600">Ad Spend:</span>{' '}
                            <span className="font-semibold text-blue-900">
                              {formatCurrency(plan.baseline.adSpend)}
                            </span>
                          </div>
                        )}
                        {plan.baseline.roas !== undefined && (
                          <div>
                            <span className="text-blue-600">ROAS:</span>{' '}
                            <span className="font-semibold text-blue-900">
                              {plan.baseline.roas.toFixed(2)}x
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actual Metrics Input */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.planning.results.actualRevenue}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={resultsData.revenue}
                        onChange={(e) => setResultsData({ ...resultsData, revenue: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.planning.results.actualCustomers}
                      </label>
                      <input
                        type="number"
                        step="1"
                        value={resultsData.customers}
                        onChange={(e) => setResultsData({ ...resultsData, customers: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.planning.results.actualAdSpend}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={resultsData.adSpend}
                        onChange={(e) => setResultsData({ ...resultsData, adSpend: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.planning.results.actualRoas}
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={resultsData.roas}
                        onChange={(e) => setResultsData({ ...resultsData, roas: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Notes Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.planning.results.notes}
                    </label>
                    <textarea
                      value={resultsData.notes}
                      onChange={(e) => setResultsData({ ...resultsData, notes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t.planning.results.notesPlaceholder}
                      rows="4"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseResultsModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                    >
                      {t.common.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={recordingResults}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {recordingResults ? (
                        <>
                          <LoadingSpinner size="sm" />
                          {t.common.saving}
                        </>
                      ) : (
                        <>
                          <FiCheckCircle className="w-4 h-4" />
                          {t.planning.results.submit}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanDetail;
