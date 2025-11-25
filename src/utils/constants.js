const DEFAULT_API_URL = import.meta.env.PROD
  ? 'https://api.nerdee.ai/api'
  : 'http://localhost:5000/api';
const DEFAULT_SOCKET_URL = import.meta.env.PROD
  ? 'https://api.nerdee.ai'
  : 'http://localhost:5000';

export const API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || DEFAULT_SOCKET_URL;

// Feature Flags
export const FEATURE_FLAGS = {
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true',
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_SETUPIQ: '/register/setupiq',
  DASHBOARD: '/',
  MARKETING: '/marketing',
  FINANCE: '/finance',
  ANALYTICS: '/analytics',
  INTEGRATIONS: '/integrations',
  FORECASTING: '/forecasting',
  PLANNING: '/planning',
  PLAN_DETAIL: '/planning/:planId',
  REPORTS: '/reports',
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
  DASHBOARD_COMPARE: '/dashboard/compare',
  DASHBOARD_INSIGHTS: '/dashboard/insights',
  DATA_ANOMALIES: '/data/anomalies',

  // New Metrics
  RETENTION_METRICS: '/dashboard/retention',
  GROWTH_METRICS: '/dashboard/growth',
  DATA_QUALITY_METRICS: '/dashboard/data-quality',
  SAC_METRICS: '/dashboard/sac',
  ALL_METRICS: '/dashboard/all-metrics',

  // Chat
  CHAT_ASK: '/chat/ask',
  CHAT_HISTORY: '/chat/history',
  SMART_REGISTER: '/smart-register',
  SMART_REGISTER_START: '/smart-register/start',
  SMART_REGISTER_SESSION: '/smart-register/:sessionId',
  SMART_REGISTER_ANSWER: '/smart-register/:sessionId/answer',
  SMART_REGISTER_FINISH: '/smart-register/:sessionId/finish',
  SMART_REGISTER_FORM: '/smart-register/form',

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
  FORECASTING_RECORD_ACTUAL: '/admin/forecasts/:id/actual',
  FORECASTING_ACCURACY_STATS: '/admin/forecasts/stats/dashboard',

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
  PLANNING_RECORD_RESULTS: '/planning/:planId/results',
  PLANNING_PERFORMANCE: '/planning/:planId/performance',

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

export const REPORT_SECTIONS = {
  MARKETING: 'marketing',
  FINANCE: 'finance',
  CROSS_ANALYSIS: 'cross-analysis',
  FORECASTING: 'forecasting',
  PLANNING: 'planning',
};

export const REPORT_SECTION_OPTIONS = [
  { value: 'marketing', label: 'Marketing', description: 'Meta Ads data' },
  { value: 'finance', label: 'Finance', description: 'Transaction/revenue data' },
  { value: 'cross-analysis', label: 'Cross Analysis', description: 'Attribution & profitability metrics' },
  { value: 'forecasting', label: 'Forecasting', description: 'AI forecast metrics' },
  { value: 'planning', label: 'Planning', description: 'Business plans data' },
];
