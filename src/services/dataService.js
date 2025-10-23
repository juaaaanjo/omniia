import api from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { getDateRangeParams } from '../utils/dateHelpers';

class DataService {
  /**
   * Get dashboard KPIs
   */
  async getKPIs(dateRange = 'last_30_days') {
    try {
      const { endDate } = getDateRangeParams(dateRange);
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      const adjustedStartDate = new Date(endDate);
      adjustedStartDate.setFullYear(adjustedStartDate.getFullYear() - 2);
      adjustedStartDate.setHours(0, 0, 0, 0);

      const response = await api.get(API_ENDPOINTS.KPIS, {
        params: {
          startDate: adjustedStartDate.toISOString(),
          endDate: adjustedEndDate.toISOString(),
        },
      });

      const payload = response?.data ?? response ?? {};
      const kpisData = payload?.kpis ?? {};
      const dateRangeInfo = payload?.dateRange ?? {
        startDate: adjustedStartDate.toISOString(),
        endDate: adjustedEndDate.toISOString(),
      };

      return {
        ...kpisData,
        dateRange: dateRangeInfo,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get marketing data
   */
  async getMarketingData(dateRange = 'last_30_days', filters = {}) {
    try {
      const { endDate } = getDateRangeParams(dateRange);
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      const adjustedStartDate = new Date(endDate);
      adjustedStartDate.setFullYear(adjustedStartDate.getFullYear() - 2);
      adjustedStartDate.setHours(0, 0, 0, 0);

      const response = await api.get(API_ENDPOINTS.MARKETING, {
        params: {
          startDate: adjustedStartDate.toISOString(),
          endDate: adjustedEndDate.toISOString(),
          ...filters,
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get sales data
   */
  async getSalesData(dateRange = 'last_30_days', filters = {}) {
    try {
      const { startDate, endDate } = getDateRangeParams(dateRange);
      const response = await api.get(API_ENDPOINTS.SALES, {
        params: { startDate, endDate, ...filters },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get finance data
   */
  async getFinanceData(dateRange = 'last_30_days', filters = {}) {
    try {
      const { endDate } = getDateRangeParams(dateRange);
      const adjustedEndDate = new Date(endDate);
      const adjustedStartDate = new Date(endDate);
      adjustedStartDate.setFullYear(adjustedStartDate.getFullYear() - 2);
      adjustedStartDate.setHours(0, 0, 0, 0);

      const response = await api.get(API_ENDPOINTS.FINANCE, {
        params: {
          startDate: adjustedStartDate.toISOString(),
          endDate: adjustedEndDate.toISOString(),
          ...filters,
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get cross-analysis data
   */
  async getCrossAnalysisData(dateRange = 'last_30_days', filters = {}) {
    try {
      const { startDate, endDate } = getDateRangeParams(dateRange);
      const response = await api.get(API_ENDPOINTS.CROSS_ANALYSIS, {
        params: { startDate, endDate, ...filters },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get sync status
   */
  async getSyncStatus() {
    try {
      const response = await api.get(API_ENDPOINTS.SYNC_STATUS);
      if (response?.data?.status) {
        return response.data.status;
      }
      if (response?.status) {
        return response.status;
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Trigger sync for all data sources
   */
  async syncAllData() {
    try {
      const { endDate } = getDateRangeParams();
      const adjustedEndDate = new Date(endDate);
      const adjustedStartDate = new Date(endDate);
      adjustedStartDate.setFullYear(adjustedStartDate.getFullYear() - 2);
      adjustedStartDate.setHours(0, 0, 0, 0);

      const response = await api.post(API_ENDPOINTS.SYNC_ALL, {
        startDate: adjustedStartDate.toISOString(),
        endDate: adjustedEndDate.toISOString(),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Export data to CSV
   */
  async exportData(type, dateRange, format = 'csv') {
    try {
      const { startDate, endDate } = getDateRangeParams(dateRange);
      const response = await api.get(`/export/${type}`, {
        params: { startDate, endDate, format },
        responseType: 'blob',
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-${dateRange}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get data for specific metric
   */
  async getMetricData(metricName, dateRange = 'last_30_days') {
    try {
      const { startDate, endDate } = getDateRangeParams(dateRange);
      const response = await api.get(`/metrics/${metricName}`, {
        params: { startDate, endDate },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Compare metrics across date ranges
   */
  async compareMetrics(metricName, dateRanges = []) {
    try {
      const response = await api.post('/metrics/compare', {
        metricName,
        dateRanges,
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sync transaction data
   */
  async syncTransactions(startDate = null, endDate = null) {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      // Ensure both dates are present for backend validation
      if (!params.startDate || !params.endDate) {
        const { startDate: defaultStart, endDate: defaultEnd } = getDateRangeParams();
        params.startDate = params.startDate || defaultStart;
        params.endDate = params.endDate || defaultEnd;
      }

      const response = await api.post('/data/sync/transactions', params);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update integration connection status
   */
  async updateIntegrationConnection(integrationType, connected) {
    try {
      const response = await api.put(`/auth/integrations/${integrationType}`, {
        connected,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Connect a specific integration
   */
  async connectIntegration(integrationType, payload = {}) {
    try {
      const response = await api.post(
        `/data/sync/${integrationType}/connect`,
        payload
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Disconnect a specific integration
   */
  async disconnectIntegration(integrationType, payload = {}) {
    try {
      const response = await api.post(
        `/data/sync/${integrationType}/disconnect`,
        payload
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Connect Meta Ads with manual token
   */
  async connectMetaAdsManual(accessToken, accountId) {
    try {
      const response = await api.put(API_ENDPOINTS.META_ADS_CONNECT_MANUAL, {
        accessToken,
        accountId,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Initiate Meta Ads OAuth flow
   */
  async initiateMetaAdsOAuth() {
    try {
      const response = await api.get(API_ENDPOINTS.META_ADS_OAUTH_INIT);

      // Backend returns the OAuth authorization URL nested in data
      const authUrl = response?.data?.authUrl || response?.authUrl;

      if (authUrl) {
        // Open OAuth page in a popup window
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
          authUrl,
          'Meta Ads OAuth',
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );

        if (!popup) {
          throw new Error('Popup blocked. Please allow popups for this site.');
        }

        // Return a promise that resolves when the popup closes
        return new Promise((resolve, reject) => {
          const checkPopup = setInterval(() => {
            if (popup.closed) {
              clearInterval(checkPopup);
              resolve({ success: true, popupClosed: true });
            }
          }, 500);

          // Listen for messages from the OAuth callback page
          const messageHandler = (event) => {
            // Verify the message origin for security
            if (event.origin !== window.location.origin) return;

            if (event.data.type === 'META_ADS_OAUTH_SUCCESS') {
              clearInterval(checkPopup);
              window.removeEventListener('message', messageHandler);
              if (popup && !popup.closed) popup.close();
              resolve({ success: true, data: event.data });
            } else if (event.data.type === 'META_ADS_OAUTH_ERROR') {
              clearInterval(checkPopup);
              window.removeEventListener('message', messageHandler);
              if (popup && !popup.closed) popup.close();
              reject(new Error(event.data.error || 'OAuth authentication failed'));
            }
          };

          window.addEventListener('message', messageHandler);

          // Timeout after 5 minutes
          setTimeout(() => {
            clearInterval(checkPopup);
            window.removeEventListener('message', messageHandler);
            if (popup && !popup.closed) popup.close();
            reject(new Error('OAuth authentication timeout'));
          }, 300000);
        });
      }

      throw new Error('No authorization URL received from server');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Sync Meta Ads data
   */
  async syncMetaAds(startDate = null, endDate = null) {
    try {
      // Set endDate to current date (not future) at end of day
      const now = new Date();
      now.setHours(23, 59, 59, 999);
      const adjustedEndDate = endDate ? new Date(endDate) : now;

      // Ensure endDate is not in the future
      if (adjustedEndDate > now) {
        adjustedEndDate.setTime(now.getTime());
      }
      adjustedEndDate.setHours(23, 59, 59, 999);

      // Set startDate to maximum 90 days before endDate
      const adjustedStartDate = startDate ? new Date(startDate) : new Date(adjustedEndDate);
      if (!startDate) {
        adjustedStartDate.setDate(adjustedStartDate.getDate() - 90);
      }
      adjustedStartDate.setHours(0, 0, 0, 0);

      // Enforce 90-day maximum range
      const maxStartDate = new Date(adjustedEndDate);
      maxStartDate.setDate(maxStartDate.getDate() - 90);
      maxStartDate.setHours(0, 0, 0, 0);

      if (adjustedStartDate < maxStartDate) {
        adjustedStartDate.setTime(maxStartDate.getTime());
      }

      const response = await api.post(API_ENDPOINTS.META_ADS_SYNC, {
        startDate: adjustedStartDate.toISOString(),
        endDate: adjustedEndDate.toISOString(),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Disconnect Meta Ads integration
   */
  async disconnectMetaAds() {
    try {
      const response = await api.post(API_ENDPOINTS.META_ADS_DISCONNECT);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get Meta Ads accounts
   */
  async getMetaAdsAccounts() {
    try {
      const response = await api.get(API_ENDPOINTS.META_ADS_ACCOUNTS);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get Meta Ads campaigns
   */
  async getMetaAdsCampaigns(accountId = null) {
    try {
      const params = accountId ? { accountId } : {};
      const response = await api.get(API_ENDPOINTS.META_ADS_CAMPAIGNS, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get Meta Ads insights
   */
  async getMetaAdsInsights(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.META_ADS_INSIGHTS, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new DataService();
