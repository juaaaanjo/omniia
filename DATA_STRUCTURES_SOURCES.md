# Data Structures - Source File Locations

This document maps each data structure to the files where they are used/defined in the codebase.

## 1. Marketing Data Structures

### Campaign Object
**Source Files:**
- `/src/components/campaigns/CampaignManagement.jsx` (lines 19-58, 77-92)
- `/src/components/dashboard/MarketingDashboard.jsx` (lines 42-58, 111-126)
- `/src/services/dataService.js` (lines 450-462)

**Key Accessors in CampaignManagement:**
```javascript
campaign.id || campaign._id || campaign.campaignId
campaign.name || campaign.campaignName || 'Untitled campaign'
campaign.totalSpend || campaign.spend || campaign.lifetimeSpend
campaign.totalImpressions || campaign.impressions
campaign.totalClicks || campaign.clicks
campaign.roas || campaign.totalROAS || campaign.avgROAS
campaign.dailyBudget || campaign.budget?.daily
campaign.status
campaign.objective || campaign.adObjective
campaign.currency || 'USD'
```

### Daily Spend Object
**Source Files:**
- `/src/components/dashboard/MarketingDashboard.jsx` (lines 100-109)

### Marketing Summary
**Source Files:**
- `/src/components/dashboard/MarketingDashboard.jsx` (lines 71-98)

### Marketing API Endpoint
**Source Files:**
- `/src/services/dataService.js` (lines 41-65)
- `/src/context/DataContext.jsx` (lines 24-38)
- `/src/utils/constants.js` (line 36)

**Endpoint:** `GET /dashboard/marketing`

---

## 2. Financial/Transaction Data Structures

### Payment Data Object
**Source Files:**
- `/src/components/dashboard/FinanceDashboard.jsx` (lines 44-56, 113-149)
- `/src/services/dataService.js` (lines 67-90)

**Key Fields Extraction:**
```javascript
const summary = financeData.summary || {};
const paymentData = financeData.paymentData || {};
const currency = paymentData.currency || 'USD';
```

### Expense Category Object
**Source Files:**
- `/src/components/dashboard/FinanceDashboard.jsx` (lines 46, 252-256)

### AR (Accounts Receivable) Aging Object
**Source Files:**
- `/src/components/dashboard/FinanceDashboard.jsx` (lines 47, 263-290)

### Revenue vs Costs Data
**Source Files:**
- `/src/components/dashboard/FinanceDashboard.jsx` (lines 48, 58-76, 186-205)

### Cash Flow Data
**Source Files:**
- `/src/components/dashboard/FinanceDashboard.jsx` (lines 50, 78-86, 208-225)

### Budget vs Actual Data
**Source Files:**
- `/src/components/dashboard/FinanceDashboard.jsx` (lines 49, 88-101, 229-244)

### Finance API Endpoint
**Source Files:**
- `/src/services/dataService.js` (lines 67-90)
- `/src/utils/constants.js` (line 37)

**Endpoint:** `GET /dashboard/finance`

---

## 3. Guardrail (Campaign Safety) Data Structures

### Guardrail Object
**Source Files:**
- `/src/components/guardrails/GuardrailForm.jsx` (lines 11-30, 32-40)
- `/src/components/campaigns/CampaignManagement.jsx` (lines 94-108)
- `/src/services/dataService.js` (lines 530-616)

**Key Fields:**
```javascript
const guardrail = {
  rules: {
    minROAS: '',
    maxCPA: '',
    maxDailySpend: '',
    minCTR: '',
    maxCPC: '',
    minConversions: '',
  },
  autoActions: {
    autoPause: false,
    alertOnly: true,
    requireConfirmation: false,
  },
  monitoring: {
    enabled: true,
    evaluationWindow: 24,
    minDataPoints: 10,
  },
};
```

### Guardrail API Endpoints
**Source Files:**
- `/src/services/dataService.js` (lines 530-616)
- `/src/utils/constants.js` (lines 73-77)

**Endpoints:**
```javascript
GET /guardrails
GET /guardrails/:id
POST /guardrails
PUT /guardrails/:id
DELETE /guardrails/:id
PATCH /guardrails/:id/toggle
POST /guardrails/:id/check
```

---

## 4. Planning Data Structures

### Plan Object
**Source Files:**
- `/src/pages/Planning.jsx` (lines 14-44, 192-285)
- `/src/pages/PlanDetail.jsx` (inferred from Planning.jsx)
- `/src/services/planningService.js` (lines 4-217)

**Key Fields Shown in UI:**
```javascript
plan._id
plan.planName
plan.planType  // revenue_growth | marketing_budget | customer_acquisition | roas_optimization | comprehensive
plan.description
plan.status    // draft | active | completed | cancelled | archived
plan.goals?.primary
plan.progress?.overall
plan.createdAt
```

### Action Item
**Source Files:**
- `/src/pages/Planning.jsx` (inferred from action items)
- `/src/services/planningService.js` (lines 123-148)

### Milestone
**Source Files:**
- `/src/pages/Planning.jsx` (inferred from milestone progress)
- `/src/services/planningService.js` (lines 150-166)

### Planning API Endpoints
**Source Files:**
- `/src/services/planningService.js` (lines 4-217)
- `/src/utils/constants.js` (lines 87-99)

**Endpoints:**
```javascript
GET /planning
GET /planning/active
GET /planning/:planId
GET /planning/:planId/insights
POST /planning/analyze
PATCH /planning/:planId/status
PATCH /planning/:planId/actions/:actionId
PATCH /planning/:planId/milestones/:milestoneId
GET /planning/stats
POST /planning/:planId/results
GET /planning/:planId/performance
```

---

## 5. Operational Intelligence (EIO) Data Structures

### Alert Object
**Source Files:**
- `/src/services/eioService.js` (lines 32-117)
- `/src/context/EioContext.jsx` (inferred)

**Key Methods:**
```javascript
async getAlerts(params = {})
async getPendingAlerts(limit = 5)
async getAlertsByCategory()
async getAlertById(alertId)
async applyAlert(alertId, payload)
async ignoreAlert(alertId, payload)
async resolveAlert(alertId, payload)
async bulkApplyAlerts(payload)
```

### Alerts Summary
**Source Files:**
- `/src/services/eioService.js` (lines 50-52)

### Daily Insights
**Source Files:**
- `/src/services/eioService.js` (lines 107-112)

### EIO API Endpoints
**Source Files:**
- `/src/services/eioService.js` (lines 31-121)
- `/src/utils/constants.js` (lines 100-113)

**Endpoints:**
```javascript
GET /eio/alerts
GET /eio/alerts/pending
GET /eio/alerts/summary
GET /eio/alerts/by-category
GET /eio/alerts/:id
POST /eio/alerts/:id/apply
POST /eio/alerts/:id/ignore
POST /eio/alerts/:id/review
POST /eio/alerts/:id/resolve
POST /eio/alerts/bulk-apply
GET /eio/alerts/report
GET /eio/insights/daily
POST /eio/check
```

---

## 6. Forecasting Data Structures

### Forecast Object
**Source Files:**
- `/src/services/dataService.js` (lines 621-690)

**Key Methods:**
```javascript
async getForecastingOptions()
async getQuickForecast()
async generateForecast(options)
async generateScenarios(options)
async recordForecastActual(forecastId, actualValues, notes)
async getForecastAccuracyStats()
```

### Forecast Accuracy Statistics
**Source Files:**
- `/src/services/dataService.js` (lines 696-703)

### Forecasting API Endpoints
**Source Files:**
- `/src/services/dataService.js` (lines 620-705)
- `/src/utils/constants.js` (lines 79-85)

**Endpoints:**
```javascript
GET /forecasting/options
GET /forecasting/quick
POST /forecasting/generate
POST /forecasting/scenarios
POST /admin/forecasts/:id/actual
GET /admin/forecasts/stats/dashboard
```

---

## 7. KPI Data Structures

### KPI Object
**Source Files:**
- `/src/services/dataService.js` (lines 5-39)
- `/src/context/DataContext.jsx` (lines 74-84)
- `/src/utils/constants.js` (line 35)

**API Endpoint:** `GET /dashboard/kpis`

**Key Methods:**
```javascript
async getKPIs(dateRange = 'last_30_days')
async getRetentionMetrics(dateRange)
async getGrowthMetrics(dateRange)
async getDataQualityMetrics(dateRange)
async getSACMetrics(dateRange)
async getAllMetrics(dateRange)
```

### Related Metric Endpoints
**Source Files:**
- `/src/services/dataService.js` (lines 758-832)
- `/src/utils/constants.js` (lines 44-48)

**Endpoints:**
```javascript
GET /dashboard/retention
GET /dashboard/growth
GET /dashboard/data-quality
GET /dashboard/sac
GET /dashboard/all-metrics
```

---

## 8. Cross-Analysis Data Structures

### Cross-Analysis Data
**Source Files:**
- `/src/services/dataService.js` (lines 92-117)
- `/src/context/DataContext.jsx` (lines 58-72)
- `/src/components/dashboard/CrossAnalysisDashboard.jsx`
- `/src/utils/constants.js` (line 38)

**API Endpoint:** `GET /dashboard/cross-analysis`

**Related Methods:**
```javascript
async getCrossAnalysisData(dateRange, filters)
async getPeriodComparison(startDate, endDate)
async getDashboardInsights(startDate, endDate)
async getAnomalies(startDate, endDate)
```

**Additional Endpoints:**
```javascript
GET /dashboard/compare
GET /dashboard/insights
GET /data/anomalies
```

---

## 9. Chat Data Structures

### Chat Service
**Source Files:**
- `/src/services/chatService.js` (lines 4-130)

**Key Methods:**
```javascript
async sendMessage(message, context = {})
async getChatHistory(userId, limit = 50, offset = 0)
async clearHistory(userId)
getSuggestedQuestions(area)
formatMessage(message, sender)
extractChartData(response)
extractTableData(response)
```

**Chat Endpoints:**
- `/src/utils/constants.js` (lines 50-52)

```javascript
POST /chat/ask
GET /chat/history/:userId
```

---

## 10. Common Data Fields

### Date Range Object
**Source Files:**
- `/src/utils/dateHelpers.js` (inferred)
- `/src/services/dataService.js` (lines 9-30, 44-51)

### Pagination Object
**Source Files:**
- `/src/pages/Planning.jsx` (lines 20, 290-310)
- `/src/services/planningService.js` (lines 13-20)

---

## 11. Context Providers

### DataContext
**Source Files:**
- `/src/context/DataContext.jsx` (complete file)

**State Management:**
```javascript
marketingData
financeData
crossAnalysisData
kpis
syncStatus
dateRange
```

**Methods:**
```javascript
fetchMarketingData()
fetchFinanceData()
fetchCrossAnalysisData()
fetchKPIs()
fetchSyncStatus()
syncAllData()
refreshAllData()
exportData()
updateDateRange()
```

### AuthContext
**Source Files:**
- `/src/context/AuthContext.jsx` (referenced in DataContext)

### ChatContext
**Source Files:**
- `/src/context/ChatContext.jsx` (referenced)

### EioContext
**Source Files:**
- `/src/context/EioContext.jsx` (referenced)

---

## 12. API Service Configuration

### API Service
**Source Files:**
- `/src/services/api.js` (lines 1-72)

**Configuration:**
```javascript
baseURL: API_BASE_URL
timeout: 120000 (2 minutes)
headers: { 'Content-Type': 'application/json' }
```

**Interceptors:**
- Request: Adds Bearer token from localStorage
- Response: Unwraps response.data, handles 401 errors

### Constants
**Source Files:**
- `/src/utils/constants.js` (complete file)

**Key Constants:**
- API_BASE_URL
- SOCKET_URL
- ROUTES
- API_ENDPOINTS (all endpoint definitions)
- CHART_COLORS
- DATE_RANGES
- SOCKET_EVENTS
- NOTIFICATION_TYPES
- REPORT_SECTIONS

---

## 13. Related Utilities

### Formatters
**Source Files:**
- `/src/utils/formatters.js`

**Key Functions:**
- formatCurrency(value, currency)
- formatDate(date, format)
- formatNumber(number, decimals)
- formatPercentage(value)
- formatRelativeTime(date)

### Date Helpers
**Source Files:**
- `/src/utils/dateHelpers.js`

**Key Functions:**
- getDateRangeParams(range)

### Validators
**Source Files:**
- `/src/utils/validators.js`

---

## Summary Table

| Data Structure | Primary Definition | Service | Context | API Endpoint |
|---|---|---|---|---|
| Campaign | CampaignManagement.jsx | dataService.js | DataContext | /meta-ads/campaigns |
| Guardrail | GuardrailForm.jsx | dataService.js | DataContext | /guardrails |
| Plan | Planning.jsx | planningService.js | - | /planning |
| Alert | eioService.js | eioService.js | EioContext | /eio/alerts |
| Forecast | dataService.js | dataService.js | DataContext | /forecasting/* |
| KPI | Dashboard.jsx | dataService.js | DataContext | /dashboard/kpis |
| Finance | FinanceDashboard.jsx | dataService.js | DataContext | /dashboard/finance |
| Marketing | MarketingDashboard.jsx | dataService.js | DataContext | /dashboard/marketing |

---

## How to Create Dummy Data

1. **Start with constants** from `/src/utils/constants.js` for valid enums
2. **Follow the shapes** defined in components (CampaignManagement, FinanceDashboard, etc.)
3. **Use realistic values** based on the formatters (currencies, dates, percentages)
4. **Nest objects correctly** - many objects have optional nested properties
5. **Match date formats** - ISO strings for timestamps, formatted strings for display
6. **Validate against** the service methods to ensure proper field names

See `DATA_STRUCTURES.md` for complete shape definitions and example dummy data.
