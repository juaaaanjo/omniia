import { createContext, useState, useCallback } from 'react';
import eioService from '../services/eioService';

export const EioContext = createContext(null);

export const EioProvider = ({ children }) => {
  const [summary, setSummary] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [pendingAlerts, setPendingAlerts] = useState([]);
  const [statusHighlights, setStatusHighlights] = useState({
    pending: null,
    applied: null,
    inReview: null,
  });
  const [alerts, setAlerts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [dailyInsights, setDailyInsights] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOverview = useCallback(async () => {
    try {
      setOverviewLoading(true);
      setError(null);

      const fetchStatusHighlight = async (statuses) => {
        const attempts = await Promise.all(
          statuses.map((status) =>
            eioService
              .getAlerts({ status, limit: 3 })
              .then((res) => res?.alerts?.[0] || null)
              .catch(() => null),
          ),
        );

        return attempts.find((item) => item) || null;
      };

      const [
        summaryData,
        pendingList,
        appliedHighlight,
        inReviewHighlight,
        insightsResult,
        categoriesResult,
      ] = await Promise.all([
        eioService.getAlertsSummary(),
        eioService.getPendingAlerts(3),
        fetchStatusHighlight(['applied', 'executed']),
        fetchStatusHighlight(['in_review', 'inReview']),
        eioService.getDailyInsights(),
        eioService.getAlertsByCategory(),
      ]);

      setSummary(summaryData);
      setPendingAlerts(Array.isArray(pendingList) ? pendingList : []);
      setStatusHighlights({
        pending: Array.isArray(pendingList) && pendingList.length > 0 ? pendingList[0] : null,
        applied: appliedHighlight || null,
        inReview: inReviewHighlight || null,
      });
      setDailyInsights(insightsResult);
      setCategoryStats(
        Array.isArray(categoriesResult)
          ? categoriesResult
          : Array.isArray(categoriesResult?.data)
            ? categoriesResult.data
            : categoriesResult?.categories || [],
      );
      setLastUpdated(new Date());

      return {
        summary: summaryData,
        pendingAlerts: pendingList,
        applied: appliedHighlight,
        inReview: inReviewHighlight,
        insights: insightsResult,
      };
    } catch (err) {
      console.error('Failed to load EIO overview:', err);
      setError(err.message || 'Failed to load EIO overview');
      throw err;
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  const fetchAlerts = useCallback(async (params = {}) => {
    try {
      setAlertsLoading(true);
      setError(null);
      const result = await eioService.getAlerts(params);
      setAlerts(result.alerts || []);
      setPagination(result.pagination);
      return result;
    } catch (err) {
      console.error('Failed to load EIO alerts:', err);
      setError(err.message || 'Failed to load alerts');
      throw err;
    } finally {
      setAlertsLoading(false);
    }
  }, []);

  const fetchAlertDetail = useCallback(async (alertId) => {
    if (!alertId) return null;

    try {
      setDetailLoading(true);
      setError(null);
      const alert = await eioService.getAlertById(alertId);
      setSelectedAlert(alert);
      return alert;
    } catch (err) {
      console.error('Failed to load alert detail:', err);
      setError(err.message || 'Failed to load alert detail');
      throw err;
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const executeAction = useCallback(async (action, alertId, payload = {}) => {
    try {
      setActionLoading(true);
      setError(null);

      let response;
      switch (action) {
        case 'apply':
          response = await eioService.applyAlert(alertId, payload);
          break;
        case 'ignore':
          response = await eioService.ignoreAlert(alertId, payload);
          break;
        case 'review':
          response = await eioService.reviewAlert(alertId, payload);
          break;
        case 'resolve':
          response = await eioService.resolveAlert(alertId, payload);
          break;
        default:
          throw new Error(`Unsupported action: ${action}`);
      }

      // Refresh overview data after action
      await fetchOverview();
      if (alertId && selectedAlert?._id === alertId) {
        setSelectedAlert(response);
      }

      return response;
    } catch (err) {
      console.error('Failed to execute EIO action:', err);
      setError(err.message || 'Failed to execute action');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [fetchOverview, selectedAlert]);

  const bulkApply = useCallback(async (payload) => {
    try {
      setActionLoading(true);
      setError(null);
      const response = await eioService.bulkApplyAlerts(payload);
      await fetchOverview();
      return response;
    } catch (err) {
      console.error('Failed to bulk apply alerts:', err);
      setError(err.message || 'Failed to apply alerts');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [fetchOverview]);

  const requestReport = useCallback(async (params) => {
    try {
      setError(null);
      const response = await eioService.getAlertsReport(params);
      return response;
    } catch (err) {
      console.error('Failed to fetch EIO report:', err);
      setError(err.message || 'Failed to fetch report');
      throw err;
    }
  }, []);

  const refreshDailyInsights = useCallback(async (params = {}) => {
    try {
      setError(null);
      const insights = await eioService.getDailyInsights(params);
      setDailyInsights(insights);
      return insights;
    } catch (err) {
      console.error('Failed to fetch EIO insights:', err);
      setError(err.message || 'Failed to fetch insights');
      throw err;
    }
  }, []);

  const triggerScan = useCallback(async (payload = {}) => {
    try {
      setActionLoading(true);
      setError(null);
      const response = await eioService.triggerCheck(payload);
      await fetchOverview();
      return response;
    } catch (err) {
      console.error('Failed to trigger EIO scan:', err);
      setError(err.message || 'Failed to trigger scan');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [fetchOverview]);

  const value = {
    summary,
    categoryStats,
    pendingAlerts,
    statusHighlights,
    alerts,
    pagination,
    selectedAlert,
    dailyInsights,
    lastUpdated,
    overviewLoading,
    alertsLoading,
    detailLoading,
    actionLoading,
    error,
    fetchOverview,
    fetchAlerts,
    fetchAlertDetail,
    executeAction,
    bulkApply,
    requestReport,
    refreshDailyInsights,
    triggerScan,
    setSelectedAlert,
  };

  return <EioContext.Provider value={value}>{children}</EioContext.Provider>;
};
