import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const replaceId = (endpoint, id) => endpoint.replace(':id', id);

const unwrap = (payload) => {
  if (!payload) return {};
  if (payload.data && typeof payload.data === 'object') {
    return payload.data;
  }
  return payload;
};

const extractAlerts = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload.alerts)) return payload.alerts;
  if (payload.alerts?.data && Array.isArray(payload.alerts.data)) return payload.alerts.data;
  if (payload.data && Array.isArray(payload.data.alerts)) return payload.data.alerts;
  if (Array.isArray(payload)) return payload;
  return [];
};

const extractPagination = (payload) => {
  if (!payload) return null;
  if (payload.pagination) return payload.pagination;
  if (payload.data?.pagination) return payload.data.pagination;
  if (payload.meta?.pagination) return payload.meta.pagination;
  return null;
};

class EioService {
  async getAlerts(params = {}) {
    const response = await api.get(API_ENDPOINTS.EIO_ALERTS, { params });
    const data = unwrap(response);
    return {
      alerts: extractAlerts(data),
      pagination: extractPagination(data),
      raw: response,
    };
  }

  async getPendingAlerts(limit = 5) {
    const response = await api.get(API_ENDPOINTS.EIO_ALERTS_PENDING, {
      params: limit ? { limit } : undefined,
    });
    const data = unwrap(response);
    return extractAlerts(data);
  }

  async getAlertsSummary() {
    const response = await api.get(API_ENDPOINTS.EIO_ALERTS_SUMMARY);
    return unwrap(response);
  }

  async getAlertsByCategory() {
    const response = await api.get(API_ENDPOINTS.EIO_ALERTS_BY_CATEGORY);
    return unwrap(response);
  }

  async getAlertById(alertId) {
    const response = await api.get(replaceId(API_ENDPOINTS.EIO_ALERT_BY_ID, alertId));
    return unwrap(response);
  }

  async applyAlert(alertId, payload = {}) {
    const response = await api.post(
      replaceId(API_ENDPOINTS.EIO_ALERT_APPLY, alertId),
      payload,
    );
    return unwrap(response);
  }

  async ignoreAlert(alertId, payload = {}) {
    const response = await api.post(
      replaceId(API_ENDPOINTS.EIO_ALERT_IGNORE, alertId),
      payload,
    );
    return unwrap(response);
  }

  async reviewAlert(alertId, payload = {}) {
    const response = await api.post(
      replaceId(API_ENDPOINTS.EIO_ALERT_REVIEW, alertId),
      payload,
    );
    return unwrap(response);
  }

  async resolveAlert(alertId, payload = {}) {
    const response = await api.post(
      replaceId(API_ENDPOINTS.EIO_ALERT_RESOLVE, alertId),
      payload,
    );
    return unwrap(response);
  }

  async bulkApplyAlerts(payload = { alertIds: [] }) {
    const response = await api.post(API_ENDPOINTS.EIO_ALERT_BULK_APPLY, payload);
    return unwrap(response);
  }

  async getAlertsReport(params = {}) {
    const response = await api.get(API_ENDPOINTS.EIO_ALERT_REPORT, { params });
    return unwrap(response);
  }

  async getDailyInsights(params = {}) {
    const response = await api.get(API_ENDPOINTS.EIO_INSIGHTS_DAILY, {
      params: Object.keys(params || {}).length ? params : undefined,
    });
    return unwrap(response);
  }

  async triggerCheck(payload = {}) {
    const response = await api.post(API_ENDPOINTS.EIO_CHECK, payload);
    return unwrap(response);
  }
}

const eioService = new EioService();
export default eioService;
