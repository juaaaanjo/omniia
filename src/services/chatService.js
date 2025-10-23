import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

class ChatService {
  /**
   * Send message to AI agent
   */
  async sendMessage(message, context = {}) {
    try {
      const response = await api.post(API_ENDPOINTS.CHAT_ASK, {
        question: message,  // API expects 'question' field
        context,
        timestamp: new Date().toISOString(),
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get chat history
   */
  async getChatHistory(userId, limit = 50, offset = 0) {
    try {
      const response = await api.get(`${API_ENDPOINTS.CHAT_HISTORY}/${userId}`, {
        params: { limit, offset },
      });

      return response.history || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Clear chat history
   */
  async clearHistory(userId) {
    try {
      const response = await api.delete(`${API_ENDPOINTS.CHAT_HISTORY}/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get suggested questions based on context
   */
  getSuggestedQuestions(area) {
    const suggestions = {
      marketing: [
        "How much did we spend on Meta Ads to generate $100k in sales?",
        "Why did costs increase this month?",
        "Compare Facebook vs Google Ads ROI",
        "What's our Customer Acquisition Cost?",
      ],
      sales: [
        "Which products have the best margin per $1 in ads?",
        "What's the conversion rate by channel?",
        "Show me sales trends for the last 30 days",
        "What's the average order value by product category?",
      ],
      finance: [
        "What's our current profit margin?",
        "Show me budget vs actual comparison",
        "What are the main cost categories this month?",
        "What's our cash flow forecast?",
      ],
      analytics: [
        "What's the ROI by channel?",
        "Show me customer lifetime value analysis",
        "Which channel has the best conversion funnel?",
        "What's the cohort retention analysis?",
      ],
    };

    return suggestions[area] || suggestions.analytics;
  }

  /**
   * Format chat message
   */
  formatMessage(message, sender = 'user') {
    return {
      id: Date.now() + Math.random(),
      message,
      sender,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Extract chart data from response
   */
  extractChartData(response) {
    if (response.chart) {
      return {
        type: response.chart.type,
        data: response.chart.data,
        options: response.chart.options,
      };
    }
    return null;
  }

  /**
   * Extract table data from response
   */
  extractTableData(response) {
    if (response.table) {
      return {
        columns: response.table.columns,
        rows: response.table.rows,
      };
    }
    return null;
  }
}

export default new ChatService();
