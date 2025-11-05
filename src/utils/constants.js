export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  MARKETING: '/marketing',
  FINANCE: '/finance',
  ANALYTICS: '/analytics',
  INTEGRATIONS: '/integrations',
  FORECASTING: '/forecasting',
  PLANNING: '/planning',
  PLAN_DETAIL: '/planning/:planId',
  OAUTH_CALLBACK: '/oauth/callback',
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  PROFILE: '/auth/profile',

  // Dashboard
  KPIS: '/dashboard/kpis',
  MARKETING: '/dashboard/marketing',
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

  // Forecasting
  FORECASTING_OPTIONS: '/forecasting/options',
  FORECASTING_QUICK: '/forecasting/quick',
  FORECASTING_GENERATE: '/forecasting/generate',
  FORECASTING_SCENARIOS: '/forecasting/scenarios',

  // Planning (Auto-Generated)
  PLANNING: '/planning',
  PLANNING_ACTIVE: '/planning/active',
  PLANNING_BY_ID: '/planning/:planId',
  PLANNING_INSIGHTS: '/planning/:planId/insights',
  PLANNING_ANALYZE: '/planning/analyze',
  PLANNING_STATUS: '/planning/:planId/status',
  PLANNING_ACTION_ITEM: '/planning/:planId/actions/:actionId',
  PLANNING_MILESTONE: '/planning/:planId/milestones/:milestoneId',
  PLANNING_STATS: '/planning/stats',

  // EIO (Operational Intelligence)
  EIO_ALERTS: '/eio/alerts',
  EIO_ALERTS_PENDING: '/eio/alerts/pending',
  EIO_ALERTS_SUMMARY: '/eio/alerts/summary',
  EIO_ALERTS_BY_CATEGORY: '/eio/alerts/by-category',
  EIO_ALERT_BY_ID: '/eio/alerts/:id',
  EIO_ALERT_APPLY: '/eio/alerts/:id/apply',
  EIO_ALERT_IGNORE: '/eio/alerts/:id/ignore',
  EIO_ALERT_REVIEW: '/eio/alerts/:id/review',
  EIO_ALERT_RESOLVE: '/eio/alerts/:id/resolve',
  EIO_ALERT_BULK_APPLY: '/eio/alerts/bulk-apply',
  EIO_ALERT_REPORT: '/eio/alerts/report',
  EIO_INSIGHTS_DAILY: '/eio/insights/daily',
  EIO_CHECK: '/eio/check',
};

export const SUGGESTED_QUESTIONS = {
  marketing: [
    "How much did we spend on Meta Ads to generate $100k in sales?",
    "Why did costs increase this month?",
    "Compare Facebook vs Google Ads ROI",
    "What's our Customer Acquisition Cost?",
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
