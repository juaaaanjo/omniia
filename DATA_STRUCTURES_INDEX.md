# Omniia Platform - Data Structures Documentation Index

## Quick Navigation

Welcome to the Omniia platform data structures documentation. This index will help you find exactly what you need.

### I want to... 

**Understand the business model**
- Start with: `DATA_STRUCTURES_README.md` > "What is Omniia?" section
- Then read: `DATA_STRUCTURES.md` > "Project Overview" section
- Finally see: `DUMMY_DATA_EXAMPLES.js` to see working examples

**Create dummy data for testing**
- Copy from: `DUMMY_DATA_EXAMPLES.js` (ready-to-use examples)
- Reference: `DATA_STRUCTURES.md` (field descriptions)
- Check: `DATA_STRUCTURES_SOURCES.md` (which fields are actually used)

**Find specific data structure definitions**
- Search: `DATA_STRUCTURES.md` for detailed field definitions
- Example: Campaign has 30+ fields documented with types and descriptions

**Find source code using a data structure**
- Search: `DATA_STRUCTURES_SOURCES.md` for file locations
- Example: "Campaign" shows which components, services, and endpoints use it

**Understand how data flows through the system**
- Read: `DATA_STRUCTURES_README.md` > "Data Flow Example"
- Follow: Meta Ads API -> Backend -> REST API -> Frontend -> React Components

**Find an API endpoint**
- Check: `DATA_STRUCTURES_README.md` > "API Endpoints Reference"
- Or: `DATA_STRUCTURES.md` > "Key API Endpoints" (section 10)

**Debug a data issue**
- Reference: `DATA_STRUCTURES_SOURCES.md` for field names
- Check: `DATA_STRUCTURES.md` for data types
- Compare: Your data with `DUMMY_DATA_EXAMPLES.js`

---

## Files Overview

| File | Size | Lines | Purpose |
|------|------|-------|---------|
| `DATA_STRUCTURES.md` | 22KB | 958 | Complete reference of all data structures, API endpoints, and example data |
| `DATA_STRUCTURES_SOURCES.md` | 12KB | 510 | Maps structures to source code locations and file references |
| `DUMMY_DATA_EXAMPLES.js` | 18KB | 803 | Ready-to-use JavaScript objects with realistic example data |
| `DATA_STRUCTURES_README.md` | 11KB | 353 | Navigation guide, quick start, and key concepts |
| `DATA_STRUCTURES_INDEX.md` | This file | - | Quick reference and navigation index |

**Total Documentation**: 63KB, 2,624 lines

---

## Data Structures Documented

### 1. Marketing Data (4 structures)
- **Campaign** - Meta/Google Ads campaign with 30+ fields
- **Daily Spend** - Daily aggregated performance
- **Marketing Summary** - Summary statistics
- **Marketing Dashboard Response** - Complete API response

See: `DATA_STRUCTURES.md` section 1

### 2. Financial Data (8 structures)
- **Payment Data** - Revenue and earnings
- **Expense Category** - Cost breakdown
- **AR Aging** - Accounts receivable by age
- **Revenue vs Costs** - Time series comparison
- **Cash Flow** - Money in/out
- **Budget vs Actual** - Planned vs actual spending
- **Finance Summary** - Profit and margin
- **Finance Dashboard Response** - Complete API response

See: `DATA_STRUCTURES.md` section 2

### 3. Guardrails (3 structures)
- **Guardrail Object** - Campaign safety rules with monitoring
- **Guardrail Form State** - Form-specific shape
- **7 API Endpoints** - CRUD operations

See: `DATA_STRUCTURES.md` section 3

### 4. Planning (4 structures)
- **Plan Object** - AI-generated business plan
- **Action Item** - Task with due date and priority
- **Milestone** - Checkpoint with target value
- **Plan Statistics** - Aggregate metrics

See: `DATA_STRUCTURES.md` section 4

### 5. Operational Intelligence (3 structures)
- **Alert Object** - Comprehensive alert with recommendations
- **Alerts Summary** - Count and categorization
- **Daily Insights** - Daily summary and recommendations

See: `DATA_STRUCTURES.md` section 5

### 6. Forecasting (3 structures)
- **Forecast Object** - Prediction with confidence interval
- **Forecast Accuracy Stats** - Historical accuracy
- **Scenario Analysis** - Best/worst/base cases

See: `DATA_STRUCTURES.md` section 6

### 7. KPI & Metrics (3 structures)
- **KPI Object** - 20+ key metrics
- **Retention Metrics** - Customer retention data
- **Growth Metrics** - Growth indicators

See: `DATA_STRUCTURES.md` section 7

### 8. Cross-Analysis (3 structures)
- **Attribution Data** - By channel attribution
- **Customer Metrics** - CAC and LTV
- **Cohort Retention** - Retention by cohort

See: `DATA_STRUCTURES.md` section 8

### 9. Common (3 structures)
- **Date Range** - Start and end dates
- **Pagination** - Page, limit, total
- **API Response Wrapper** - Response envelope

See: `DATA_STRUCTURES.md` section 9

**Total: 40+ documented data structures**

---

## API Endpoints by Category

### Dashboard (7 endpoints)
```
GET /dashboard/kpis
GET /dashboard/marketing
GET /dashboard/finance
GET /dashboard/cross-analysis
GET /dashboard/compare
GET /dashboard/insights
GET /data/anomalies
```

### Campaigns & Guardrails (14 endpoints)
```
GET /meta-ads/campaigns
POST /meta-ads/campaigns/:id/pause
POST /meta-ads/campaigns/:id/activate
POST /meta-ads/campaigns/:id/rollback
GET /meta-ads/campaigns/:id/history

GET /guardrails
POST /guardrails
PUT /guardrails/:id
DELETE /guardrails/:id
PATCH /guardrails/:id/toggle
POST /guardrails/:id/check
```

### Planning (10 endpoints)
```
GET /planning
GET /planning/active
GET /planning/:id
POST /planning/analyze
PATCH /planning/:id/status
PATCH /planning/:id/actions/:actionId
PATCH /planning/:id/milestones/:milestoneId
POST /planning/:id/results
GET /planning/:id/performance
```

### Forecasting (6 endpoints)
```
GET /forecasting/options
GET /forecasting/quick
POST /forecasting/generate
POST /forecasting/scenarios
POST /admin/forecasts/:id/actual
GET /admin/forecasts/stats/dashboard
```

### Operational Intelligence (13 endpoints)
```
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

### Chat (2 endpoints)
```
POST /chat/ask
GET /chat/history/:userId
```

**Total: 52 API endpoints documented**

---

## Example Data Provided

| Type | Count | Examples |
|------|-------|----------|
| Campaigns | 3 | Summer Sale, Black Friday, Product Launch |
| Finance Data | 1 | Complete dashboard with all categories |
| Guardrails | 2 | Auto-pause and alert-only modes |
| Plans | 2 | Revenue growth and customer acquisition |
| Alerts | 3 | ROAS threshold, anomaly, CPA threshold |
| Forecasts | 2 | Revenue (completed) and ad spend (pending) |
| KPIs | 1 | Complete metrics snapshot |
| Cross-Analysis | 1 | Attribution, metrics, and cohorts |

All examples are in `DUMMY_DATA_EXAMPLES.js` - ready to use directly!

---

## Source Code Files Referenced

### Services
- `src/services/dataService.js` - Marketing, Finance, Forecasting, KPIs
- `src/services/planningService.js` - Business plans
- `src/services/eioService.js` - Operational intelligence alerts
- `src/services/chatService.js` - Chat and AI

### Components
- `src/components/campaigns/CampaignManagement.jsx` - Campaign display
- `src/components/dashboard/MarketingDashboard.jsx` - Marketing metrics
- `src/components/dashboard/FinanceDashboard.jsx` - Finance metrics
- `src/components/guardrails/GuardrailForm.jsx` - Guardrail configuration

### Context Providers
- `src/context/DataContext.jsx` - Main data management
- `src/context/EioContext.jsx` - Operational intelligence
- `src/context/AuthContext.jsx` - Authentication

### Utilities
- `src/utils/constants.js` - API endpoints and configuration
- `src/utils/formatters.js` - Data formatting functions
- `src/utils/dateHelpers.js` - Date range utilities

---

## Common Field Names

Important: Some fields have alternative names used across the codebase:

### Campaign Fields
- ID: `campaign.id` || `campaign._id` || `campaign.campaignId`
- Name: `campaign.name` || `campaign.campaignName`
- Spend: `campaign.totalSpend` || `campaign.spend` || `campaign.lifetimeSpend`
- ROAS: `campaign.roas` || `campaign.totalROAS` || `campaign.avgROAS`
- Budget: `campaign.dailyBudget` || `campaign.budget?.daily`

### Plan Fields
- ID: `plan._id` || `plan.planId`
- Type: `plan.planType` (revenue_growth, marketing_budget, etc.)
- Status: `plan.status` (draft, active, completed, cancelled, archived)

### Alert Fields
- ID: `alert._id` || `alert.alertId`
- Severity: `alert.severity` (critical, high, medium, low, info)
- Status: `alert.status` (pending, applied, ignored, reviewed, resolved)

---

## Key Metrics & Calculations

```
ROAS = Revenue / Ad Spend
CPA = Ad Spend / Conversions
CPC = Ad Spend / Clicks
CTR = (Clicks / Impressions) * 100
Profit Margin = ((Revenue - Expenses) / Revenue) * 100
LTV/CAC Ratio = Customer Lifetime Value / Customer Acquisition Cost
```

**Healthy Ranges**:
- ROAS: 2.0 - 5.0x
- CPA: $30 - $100
- CTR: 1% - 5%
- Profit Margin: 40% - 70%
- LTV/CAC: 3:1 or higher

---

## Best Practices for Dummy Data

1. **Keep metrics consistent** - ROAS = Revenue / Spend
2. **Use realistic values** - See healthy ranges above
3. **Match field names** - Check alternatives in section above
4. **Use proper types** - Numbers not strings, ISO dates
5. **Include required fields** - Check examples for reference
6. **Nest objects correctly** - Follow the structure exactly
7. **Date formatting** - ISO 8601: "2024-11-10T00:00:00Z"

---

## Common Issues & Solutions

### Issue: Field not found
**Solution**: Check `DATA_STRUCTURES_SOURCES.md` for alternative field names

### Issue: Inconsistent metrics
**Solution**: Verify calculations in the "Key Metrics & Calculations" section above

### Issue: Wrong data type
**Solution**: Reference `DATA_STRUCTURES.md` for field type definitions

### Issue: Missing optional fields
**Solution**: Check examples in `DUMMY_DATA_EXAMPLES.js` for what's typically included

### Issue: Can't find API endpoint
**Solution**: Search this file for "API Endpoints by Category" section

---

## Getting Started Checklist

- [ ] Read `DATA_STRUCTURES_README.md` (10 mins)
- [ ] Review project overview in `DATA_STRUCTURES.md` (5 mins)
- [ ] Browse `DUMMY_DATA_EXAMPLES.js` for examples (10 mins)
- [ ] Find relevant structure in `DATA_STRUCTURES.md` (varies)
- [ ] Check source files in `DATA_STRUCTURES_SOURCES.md` (varies)
- [ ] Create your dummy data using the patterns (varies)
- [ ] Test with API endpoints (varies)
- [ ] Refer back to docs as needed (ongoing)

---

## Support

For any questions about:
- **Data structures**: See `DATA_STRUCTURES.md`
- **Source code locations**: See `DATA_STRUCTURES_SOURCES.md`
- **Example data**: See `DUMMY_DATA_EXAMPLES.js`
- **Navigation**: See `DATA_STRUCTURES_README.md`
- **Quick reference**: See this file

All files are in `/Users/prueba/omniia/`

---

**Last Updated**: 2024-11-10
**Documentation Version**: 1.0
**Platform**: Omniia Analytics Platform

