import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiTrendingUp, FiCheck, FiX, FiEye, FiZap } from 'react-icons/fi';
import { useLanguage } from '../hooks/useLanguage';
import { ROUTES } from '../utils/constants';
import planningService from '../services/planningService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';

const Planning = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchPlans();
  }, [statusFilter, typeFilter, page]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
      };
      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter && typeFilter !== 'all') params.planType = typeFilter;

      const response = await planningService.getAllPlans(params);
      setPlans(response.plans || []);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeNow = async () => {
    try {
      setAnalyzing(true);
      await planningService.triggerAnalysis();

      // Wait 2-3 seconds for backend to process
      setTimeout(async () => {
        await fetchPlans();
        setAnalyzing(false);
      }, 2500);
    } catch (error) {
      console.error('Error triggering analysis:', error);
      setAnalyzing(false);
    }
  };

  const handleAcceptPlan = async (planId) => {
    try {
      await planningService.acceptPlan(planId);
      await fetchPlans();
    } catch (error) {
      console.error('Error accepting plan:', error);
    }
  };

  const handleRejectPlan = async (planId) => {
    try {
      await planningService.rejectPlan(planId);
      await fetchPlans();
    } catch (error) {
      console.error('Error rejecting plan:', error);
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

  const isNewPlan = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    const hoursDiff = (now - created) / (1000 * 60 * 60);
    return hoursDiff < 24;
  };

  if (loading && plans.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" message={t.planning.messages.loading} />
      </div>
    );
  }

  return (
    <div className="space-y-section">
      {/* Analyze Button */}
      <div className="flex justify-end">
        <button
          onClick={handleAnalyzeNow}
          disabled={analyzing}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiZap className={`w-5 h-5 ${analyzing ? 'animate-spin' : ''}`} />
          {analyzing ? t.planning.analyzing : t.planning.analyzeNow}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 card p-4">
        <div className="flex-1">
          <label className="block text-sm font-normal text-gray-700 mb-2">
            {t.planning.status.draft}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">{t.planning.allPlans}</option>
            <option value="draft">{t.planning.status.draft}</option>
            <option value="active">{t.planning.status.active}</option>
            <option value="completed">{t.planning.status.completed}</option>
            <option value="cancelled">{t.planning.status.cancelled}</option>
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-normal text-gray-700 mb-2">
            {t.planning.table.type}
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">{t.planning.allPlans}</option>
            <option value="revenue_growth">{t.planning.planTypes.revenue_growth}</option>
            <option value="marketing_budget">{t.planning.planTypes.marketing_budget}</option>
            <option value="customer_acquisition">{t.planning.planTypes.customer_acquisition}</option>
            <option value="roas_optimization">{t.planning.planTypes.roas_optimization}</option>
            <option value="comprehensive">{t.planning.planTypes.comprehensive}</option>
          </select>
        </div>
      </div>

      {/* Plans List */}
      {plans.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="max-w-md mx-auto">
            <FiZap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {t.planning.messages.noPlans}
            </h3>
            <p className="text-gray-600 mb-6">
              {t.planning.messages.noPlansCta}
            </p>
            <button
              onClick={handleAnalyzeNow}
              disabled={analyzing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FiZap className={analyzing ? 'animate-spin' : ''} />
              {analyzing ? t.planning.analyzing : t.planning.analyzeNow}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`card transition-all hover:shadow-md ${
                isNewPlan(plan.createdAt) ? 'border border-primary-500 ring-2 ring-primary-200' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-medium text-gray-900">{plan.planName}</h3>
                      {isNewPlan(plan.createdAt) && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-3">{plan.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeBadge(plan.planType)}`}>
                        {t.planning.planTypes[plan.planType] || plan.planType}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(plan.status)}`}>
                        {t.planning.status[plan.status] || plan.status}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {plan.status === 'active' && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">{t.planning.detail.progress}</span>
                          <span className="font-medium text-gray-900">{plan.progress.overall}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${plan.progress.overall}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Goals Preview */}
                    {plan.goals?.primary && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm font-normal text-gray-700 mb-1">{t.planning.form.primaryGoal}</p>
                        <p className="text-lg font-medium text-gray-900">
                          {plan.goals.primary.metric}: {formatCurrency(plan.goals.primary.target)} {plan.goals.primary.unit}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="ml-6 flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/planning/${plan._id}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FiEye className="w-4 h-4" />
                      {t.planning.table.view}
                    </button>

                    {plan.status === 'draft' && (
                      <>
                        <button
                          onClick={() => handleAcceptPlan(plan._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FiCheck className="w-4 h-4" />
                          {t.planning.acceptPlan}
                        </button>
                        <button
                          onClick={() => handleRejectPlan(plan._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                          {t.planning.rejectPlan}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.common.previous || 'Previous'}
          </button>
          <span className="px-4 py-2 text-gray-700">
            {page} / {pagination.pages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.common.next || 'Next'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Planning;
