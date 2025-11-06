import api from './api';

class ReportsService {
  /**
   * Check email service status
   * @returns {Promise} Email status data
   */
  async checkEmailStatus() {
    try {
      const response = await api.get('/admin/reports/email-status');
      return response.data || response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Preview report (returns HTML)
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @param {string[]} params.sections - Array of section types
   * @returns {Promise} HTML content
   */
  async previewReport(params = {}) {
    try {
      // Convert sections array to comma-separated string for query params
      const queryParams = { ...params };
      if (queryParams.sections && Array.isArray(queryParams.sections)) {
        queryParams.sections = queryParams.sections.join(',');
      }

      // This returns HTML, not JSON
      const response = await api.get('/admin/reports/preview', {
        params: queryParams,
        responseType: 'text'
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Open report preview in new window
   * @param {Object} params - Query parameters
   */
  openPreviewWindow(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const token = localStorage.getItem('token');
    const baseURL = api.defaults.baseURL;
    const url = `${baseURL}/admin/reports/preview?${queryString}`;

    // Open in new window with auth token
    const previewWindow = window.open('', '_blank');

    // Fetch with auth header and display in the new window
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.text())
      .then(html => {
        previewWindow.document.write(html);
        previewWindow.document.close();
      })
      .catch(error => {
        console.error('Error loading preview:', error);
        previewWindow.close();
        throw error;
      });
  }

  /**
   * Send custom report
   * @param {Object} data - Report configuration
   * @param {string[]} data.emails - Recipient email addresses
   * @param {string} data.startDate - Start date (YYYY-MM-DD, optional, defaults to 7 days ago)
   * @param {string} data.endDate - End date (YYYY-MM-DD, optional, defaults to today)
   * @param {string[]} data.sections - Array of section types (marketing, finance, cross-analysis, forecasting, planning)
   * @returns {Promise} Send result
   */
  async sendCustomReport(data) {
    try {
      const response = await api.post('/admin/reports/send', data);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send weekly report to all admins
   * @returns {Promise} Send result
   */
  async sendWeeklyReport() {
    try {
      const response = await api.post('/admin/reports/weekly');
      return response.data || response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Send monthly report to all admins
   * @returns {Promise} Send result
   */
  async sendMonthlyReport() {
    try {
      const response = await api.post('/admin/reports/monthly');
      return response.data || response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Test email configuration
   * @param {string} email - Test recipient email
   * @returns {Promise} Test result
   */
  async testEmail(email) {
    try {
      const response = await api.post('/admin/reports/test-email', { email });
      return response.data || response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate date range
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {Object} Validation result
   */
  validateDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (start > today) {
      return { valid: false, message: 'Start date cannot be in the future' };
    }

    if (end > today) {
      return { valid: false, message: 'End date cannot be in the future' };
    }

    if (start > end) {
      return { valid: false, message: 'Start date must be before end date' };
    }

    return { valid: true };
  }

  /**
   * Format date for API (YYYY-MM-DD)
   * @param {Date} date - Date to format
   * @returns {string} Formatted date
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Get default date range for reports
   * @param {string} period - 'week' | 'month'
   * @returns {Object} Date range
   */
  getDefaultDateRange(period = 'week') {
    const endDate = new Date();
    const startDate = new Date();

    if (period === 'week') {
      startDate.setDate(endDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(endDate.getMonth() - 1);
    }

    return {
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate)
    };
  }
}

export default new ReportsService();
