# Omniia Platform - Data Structures Documentation

## Overview

This documentation package provides comprehensive information about the Omniia platform's data structures, business model, and how to create dummy data that matches the system exactly.

## What is Omniia?

**Omniia** is a comprehensive **Business Analytics & Planning Platform with AI-powered insights**. It serves as an integrated system for:

1. **Marketing Analytics** - Track Meta Ads, Google Ads, and other channels
2. **Financial Management** - Revenue tracking, expense analysis, profitability
3. **Business Planning** - AI-generated strategic plans with automated execution
4. **Campaign Safety** - Guardrails that automatically protect campaign performance
5. **Operational Intelligence** - Real-time alerts and recommendations
6. **Forecasting** - Revenue and metric predictions with accuracy learning

## Files in This Documentation

### 1. `DATA_STRUCTURES.md` (958 lines)
**Complete reference of all data structures**

Contains detailed definitions of:
- Campaign objects with all fields
- Financial/transaction data structures
- Guardrail (campaign safety) configurations
- Business plan structures
- Operational intelligence alerts
- Forecasting models
- KPI metrics
- Cross-channel analysis data
- Example dummy data for each type

**Use this when:** You need to understand what fields exist in a data structure and their types.

### 2. `DATA_STRUCTURES_SOURCES.md`
**Maps each data structure to its source files in the codebase**

Shows where each structure is:
- Defined in the UI components
- Used in services
- Exposed through API endpoints
- Managed in context providers

**Use this when:** You want to find the actual code that uses a data structure.

### 3. `DUMMY_DATA_EXAMPLES.js` (803 lines)
**Ready-to-use dummy data for testing and development**

Contains realistic examples of:
- 3 sample campaigns with full metrics
- Complete finance dashboard response
- 2 configured guardrails
- 2 business plans with action items
- 3 operational intelligence alerts
- 2 forecasts with accuracy stats
- Full KPI snapshot
- Cross-analysis data with retention cohorts

**Use this when:** You need test data to populate your application or database.

### 4. This file (`DATA_STRUCTURES_README.md`)
**Navigation guide for the documentation**

## Quick Start

### If you want to understand the business model:
1. Read the "Project Overview" section in `DATA_STRUCTURES.md`
2. Review the business features listed in this file
3. Look at example dummy data to see how everything connects

### If you need to create dummy data:
1. Copy structures from `DUMMY_DATA_EXAMPLES.js`
2. Modify values as needed
3. Reference `DATA_STRUCTURES.md` for field descriptions
4. Use the API endpoint examples to understand response shapes

### If you want to understand the code architecture:
1. Start with `DATA_STRUCTURES_SOURCES.md`
2. Look at the files mentioned there
3. Follow the data flow from component -> service -> API

## Key Business Concepts

### Marketing Data
- **Campaign**: A Meta Ads or Google Ads campaign with performance metrics (spend, impressions, clicks, revenue, ROAS)
- **Daily Spend**: Aggregated daily performance across all campaigns
- **Metrics**: CPC (cost per click), CPA (cost per acquisition), ROAS (return on ad spend), CTR (click-through rate)

### Financial Data
- **Revenue**: Total income from sales
- **Expenses**: Cost of goods sold, ad spend, operational costs
- **Profit Margin**: (Revenue - Expenses) / Revenue * 100
- **AR Aging**: Accounts receivable organized by payment age

### Guardrails
- **Safety Rules**: Minimum ROAS, maximum CPA, maximum daily spend, minimum CTR
- **Auto Actions**: Can automatically pause campaigns if rules are violated
- **Monitoring**: Tracks performance over evaluation windows (e.g., 24 hours)

### Business Plans (AI-Generated)
- **Plan Types**: Revenue growth, marketing budget optimization, customer acquisition, ROAS optimization
- **Action Items**: Specific tasks with due dates and priority
- **Milestones**: Checkpoints with target values
- **Progress Tracking**: Overall completion percentage

### Operational Intelligence (EIO)
- **Alerts**: Automated notifications about performance issues or opportunities
- **Severity Levels**: Critical, high, medium, low, info
- **Recommendations**: Actionable suggestions to address alerts
- **Status**: Pending, applied, ignored, reviewed, resolved

### Forecasting
- **Types**: Revenue, ad spend, customer growth, ROAS, comprehensive
- **Periods**: Next week, next month, next quarter, or custom
- **Confidence Levels**: 0.2 to 0.95 (20% to 95% confidence)
- **Learning**: System tracks actual vs predicted for accuracy improvement

## Data Flow Example

Here's how data flows through the platform:

```
Meta Ads API / Finance System
          |
          v
Backend Services (Node.js/Python)
          |
          v
REST API Endpoints
  - /dashboard/marketing
  - /dashboard/finance
  - /guardrails
  - /planning
  - /eio/alerts
  - /forecasting/...
          |
          v
Frontend Services (dataService.js, eioService.js, etc.)
          |
          v
Context Providers (DataContext, EioContext, etc.)
          |
          v
React Components (Dashboards, Cards, Charts)
          |
          v
User sees visualizations and alerts
```

## Creating Dummy Data - Best Practices

### 1. Keep data consistent
- If a campaign has 10,000 impressions and 500 clicks, CTR should be 5%
- If revenue is 15,000 and ad spend is 5,000, ROAS should be 3.0
- ROAS = Revenue / Spend

### 2. Use realistic values
- CPA (Customer Acquisition Cost): 30-100
- ROAS (Return on Ad Spend): 2.0-5.0
- CTR (Click-through Rate): 1%-5%
- Profit Margin: 40%-70% for SaaS

### 3. Match field names exactly
Reference `DATA_STRUCTURES_SOURCES.md` to see which field names components expect:
- Some fields have alternatives: `campaign.name` OR `campaign.campaignName`
- Always check for both variants

### 4. Use proper data types
- Numbers for metrics (not strings): `spend: 5000` not `spend: "5000"`
- ISO strings for dates: `"2024-11-10T00:00:00Z"`
- Proper nesting: `budget: { daily: 250 }` not `budget: { dailyBudget: 250 }`

### 5. Include required fields
From the examples:
- Campaigns need: id, name, status, spend, impressions, clicks, revenue
- Plans need: _id, planName, planType, status, goals
- Alerts need: _id, title, message, severity, status
- Guardrails need: campaignId, rules, autoActions, monitoring

## API Endpoints Reference

### Dashboard
```
GET /dashboard/kpis
GET /dashboard/marketing
GET /dashboard/finance
GET /dashboard/cross-analysis
GET /dashboard/compare
GET /dashboard/insights
GET /data/anomalies
```

### Campaigns & Guardrails
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

### Planning
```
GET /planning
GET /planning/active
GET /planning/:id
GET /planning/:id/insights
POST /planning/analyze
PATCH /planning/:id/status
PATCH /planning/:id/actions/:actionId
PATCH /planning/:id/milestones/:milestoneId
POST /planning/:id/results
GET /planning/:id/performance
```

### Forecasting
```
GET /forecasting/options
GET /forecasting/quick
POST /forecasting/generate
POST /forecasting/scenarios
POST /admin/forecasts/:id/actual
GET /admin/forecasts/stats/dashboard
```

### Operational Intelligence
```
GET /eio/alerts
GET /eio/alerts/pending
GET /eio/alerts/summary
GET /eio/alerts/by-category
POST /eio/alerts/:id/apply
POST /eio/alerts/:id/ignore
POST /eio/alerts/:id/review
POST /eio/alerts/:id/resolve
GET /eio/insights/daily
POST /eio/check
```

## Common Enums/Constants

### Campaign Status
- `ACTIVE` - Currently running
- `PAUSED` - Temporarily stopped
- `ARCHIVED` - Completed/old
- `COMPLETED` - Finished
- `UNKNOWN` - Unknown state

### Plan Types
- `revenue_growth` - Increase revenue
- `marketing_budget` - Optimize ad spend
- `customer_acquisition` - Get more customers
- `roas_optimization` - Improve ROAS
- `comprehensive` - Multi-objective

### Plan Status
- `draft` - Awaiting approval
- `active` - Running
- `completed` - Finished
- `cancelled` - Rejected
- `archived` - Old/inactive

### Alert Severity
- `critical` - Immediate action required
- `high` - Important issue
- `medium` - Monitor closely
- `low` - Minor concern
- `info` - FYI only

### Action Item Status
- `pending` - Not started
- `in_progress` - Currently being done
- `completed` - Finished

## Common Pitfalls When Creating Dummy Data

1. **Inconsistent metrics** - Make sure ROAS = Revenue / Spend
2. **Wrong date formats** - Use ISO strings: "2024-11-10T00:00:00Z"
3. **Missing required fields** - Check the component code for what's actually used
4. **Mismatched field names** - Campaigns can have `name` or `campaignName`
5. **Wrong data types** - Spend should be a number, not a string
6. **Unrealistic values** - ROAS of 0.5 or 100x would break visualizations

## File Locations in Repository

All files are in the root of the Omniia project:

```
/Users/prueba/omniia/
├── DATA_STRUCTURES.md                 # This documentation
├── DATA_STRUCTURES_SOURCES.md         # Source file mapping
├── DUMMY_DATA_EXAMPLES.js             # Ready-to-use test data
├── DATA_STRUCTURES_README.md          # This file
├── src/
│   ├── services/
│   │   ├── dataService.js             # Marketing, Finance, Forecasting
│   │   ├── planningService.js         # Business plans
│   │   ├── eioService.js              # Operational intelligence
│   │   └── chatService.js             # Chat/AI
│   ├── components/
│   │   ├── dashboard/
│   │   ├── campaigns/
│   │   └── guardrails/
│   ├── context/
│   │   └── DataContext.jsx            # Main data management
│   ├── utils/
│   │   ├── constants.js               # API endpoints
│   │   └── formatters.js              # Data formatting
│   └── pages/
│       ├── Planning.jsx
│       ├── Marketing.jsx
│       └── Finance.jsx
└── package.json
```

## Next Steps

1. **Read** `DATA_STRUCTURES.md` for detailed field descriptions
2. **Copy** examples from `DUMMY_DATA_EXAMPLES.js`
3. **Reference** `DATA_STRUCTURES_SOURCES.md` to understand component expectations
4. **Create** your test data using the patterns shown
5. **Test** by sending data through the API endpoints

## Support & Questions

If you need to understand a specific structure:

1. Search for it in `DATA_STRUCTURES.md`
2. Find its source files in `DATA_STRUCTURES_SOURCES.md`
3. Look at the example in `DUMMY_DATA_EXAMPLES.js`
4. Check the actual component code mentioned in the sources

## Version Information

- **Platform**: Omniia
- **Frontend**: React 18
- **API Client**: Axios
- **State Management**: React Context API
- **Documentation Date**: 2024-11-10

---

**Last Updated**: 2024-11-10

For the latest code examples, always refer to the actual source files in `/src` rather than relying solely on documentation, as the codebase may evolve.
