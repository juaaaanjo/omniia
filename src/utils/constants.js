export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  MARKETING: '/marketing',
  SALES: '/sales',
  FINANCE: '/finance',
  ANALYTICS: '/analytics',
  INTEGRATIONS: '/integrations',
  OAUTH_CALLBACK: '/oauth/callback',
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',

  // Dashboard
  KPIS: '/dashboard/kpis',
  MARKETING: '/dashboard/marketing',
  SALES: '/dashboard/sales',
  FINANCE: '/dashboard/finance',
  CROSS_ANALYSIS: '/dashboard/cross-analysis',

  // Chat
  CHAT_ASK: '/chat/ask',
  CHAT_HISTORY: '/chat/history',

  // Sync
  SYNC_STATUS: '/data/sync/status',
  SYNC_ALL: '/data/sync/all',

  // Meta Ads
  META_ADS_OAUTH_INIT: '/meta-ads/oauth/init',
  META_ADS_CONNECT_MANUAL: '/auth/integrations/meta-ads',
  META_ADS_SYNC: '/meta-ads/sync',
  META_ADS_DISCONNECT: '/meta-ads/disconnect',
  META_ADS_ACCOUNTS: '/meta-ads/accounts',
  META_ADS_CAMPAIGNS: '/meta-ads/campaigns',
  META_ADS_INSIGHTS: '/meta-ads/insights',

  // Campaign Actions
  META_ADS_CAMPAIGN_PAUSE: '/meta-ads/campaigns/:campaignId/pause',
  META_ADS_CAMPAIGN_ACTIVATE: '/meta-ads/campaigns/:campaignId/activate',
  META_ADS_CAMPAIGN_ROLLBACK: '/meta-ads/campaigns/:campaignId/rollback',
  META_ADS_CAMPAIGN_HISTORY: '/meta-ads/campaigns/:campaignId/history',

  // Guardrails
  GUARDRAILS: '/guardrails',
  GUARDRAIL_BY_ID: '/guardrails/:id',
  GUARDRAIL_CHECK: '/guardrails/:id/check',
  GUARDRAIL_TOGGLE: '/guardrails/:id/toggle',
};

export const SUGGESTED_QUESTIONS = {
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

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  meta: '#4267B2',
  google: '#EA4335',
  shopify: '#96bf48',
};

export const DATE_RANGES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last_7_days',
  LAST_30_DAYS: 'last_30_days',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_YEAR: 'this_year',
  CUSTOM: 'custom',
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  DATA_UPDATED: 'data_updated',
  SYNC_STATUS: 'sync_status',
  CHAT_RESPONSE: 'chat_response',
  NOTIFICATION: 'notification',
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};
