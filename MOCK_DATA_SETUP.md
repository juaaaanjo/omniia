# Mock Data Feature Setup

This document explains how to use the mock/dummy data feature in the Omniia platform for development and testing.

## Overview

The mock data feature allows you to run the application with realistic dummy data instead of making real API calls. This is useful for:

- **Frontend development** without a running backend
- **Testing UI components** with consistent data
- **Demos and presentations** with realistic but fake data
- **Offline development** when you don't have internet access
- **Fast prototyping** without database setup

## Quick Start

### Enable Mock Data

1. Open your `.env` file in the project root
2. Set the flag to `true`:

```env
VITE_USE_MOCK_DATA=true
```

3. Restart your development server:

```bash
npm run dev
```

### Disable Mock Data (Use Real API)

1. Set the flag to `false` in `.env`:

```env
VITE_USE_MOCK_DATA=false
```

2. Restart your development server

## What Data is Mocked?

When mock data is enabled, the following services return dummy data:

### DataService
- ✅ `getKPIs()` - Dashboard KPIs
- ✅ `getMarketingData()` - Marketing campaigns and metrics
- ✅ `getFinanceData()` - Financial data and transactions
- ✅ `getCrossAnalysisData()` - Attribution and profitability
- ✅ `getSyncStatus()` - Data sync status
- ✅ `getMetaAdsCampaigns()` - Meta Ads campaigns
- ✅ `getGuardrails()` - Campaign guardrails
- ✅ `getForecastAccuracyStats()` - Forecast accuracy statistics

### EioService (Alerts)
- ✅ `getAlerts()` - All alerts
- ✅ `getPendingAlerts()` - Pending alerts only
- ✅ `getAlertsSummary()` - Alert summary statistics
- ✅ `getAlertsByCategory()` - Alerts grouped by category
- ✅ `getAlertById()` - Single alert details
- ✅ `getDailyInsights()` - Daily operational insights

### PlanningService
- ✅ `getAllPlans()` - All business plans
- ✅ `getActivePlans()` - Active plans only
- ✅ `getPlanById()` - Single plan details

## Mock Data Details

The mock data is located in `/src/utils/mockData.js` and includes:

### Marketing Data
- **3 campaigns**: Summer Sale 2024, Black Friday Promo, Product Launch
- Realistic metrics: ROAS, CPA, CTR, spend, impressions, clicks
- Daily spend history for the last 3 days
- Campaign summary with top performer

### Finance Data (**ENHANCED**)
- Revenue: **2,850,000 COP** (significantly increased)
- Expenses: **985,000 COP** (broken down by 4 categories)
- Profit margin: 65.44%
- **25 individual transactions** with customer details, dates, and amounts
- AR aging buckets (current, 30+, 60+, 90+)
- Cash flow data (5 months historical)
- Budget vs actual comparisons
- Revenue vs costs trend analysis

### EIO Alerts
- **3 alerts**: ROAS below threshold, revenue spike, CPA exceeds limit
- Alert summary with counts by severity and category
- Pending alerts (status: pending)
- Daily insights with recommendations

### Planning (**MASSIVELY EXPANDED**)
- **5 comprehensive plans** covering different business scenarios:
  1. **Q4 Revenue Growth Initiative** (active) - 3.5M COP target, 68% progress
  2. **Customer Acquisition Acceleration** (active) - 1,200 new customers, 42% progress
  3. **Retention & LTV Maximization** (active) - 85% retention target, 35% progress
  4. **Product Line Expansion - Premium Tier** (draft) - 850k revenue target
  5. **Operational Efficiency Initiative** (completed) - 195k cost savings achieved
- **14 action items** across all plans with assignees and estimated impact
- **10 milestones** with target/actual values
- Multiple plan types: revenue_growth, customer_acquisition, retention, product_expansion, cost_optimization

### Analytics Page Data (**NEW**)
- **Retention Metrics**:
  - Overall retention curves (day 1, 7, 30, 60, 90)
  - Segmented retention (Enterprise, Mid-Market, SMB)
  - 5 cohort retention analyses with revenue tracking
  - Churn analysis with reasons breakdown

- **Growth Analytics**:
  - 7 months of user growth data
  - Revenue growth trends with MRR
  - Quick ratio, magic number, growth efficiency metrics

- **Funnel Analysis**:
  - Complete conversion funnel (visitors → retained customers)
  - 5 channel breakdowns with CAC
  - Drop-off point analysis

- **Segment Analysis**:
  - Customer type segments (Enterprise, Mid-Market, SMB)
  - Geographic breakdown (4 regions)
  - Product tier analysis with churn and expansion rates

- **Lifecycle Metrics**:
  - 5 customer lifecycle stages
  - Time to value metrics
  - Expansion revenue breakdown (upsell, cross-sell, add-ons)

- **Product Analytics**:
  - Feature adoption rates for 5 features
  - DAU/MAU engagement metrics
  - Product stickiness indicators

### Guardrails
- **2 guardrail rules** for campaigns
- Auto-pause configurations
- Monitoring settings with evaluation windows

### Forecasting
- **2 forecasts**: Revenue and ad spend
- Accuracy statistics: 87.5% average
- Confidence intervals and trends
- Historical accuracy tracking by forecast type

### KPIs & Cross-Analysis
- Customer metrics: CAC, LTV, retention
- Channel attribution (Meta, Google, Organic)
- Cohort retention analysis
- Multi-touch attribution models

## Customizing Mock Data

To customize the mock data:

1. Open `/src/utils/mockData.js`
2. Modify the dummy data objects (e.g., `dummyCampaigns`, `dummyAlerts`, etc.)
3. Save the file - changes will be reflected immediately (hot reload)

Example: Add a new campaign:

```javascript
const dummyCampaigns = [
  // ... existing campaigns
  {
    _id: "new_campaign_id",
    name: "Your New Campaign",
    totalSpend: 1000,
    totalRevenue: 3500,
    roas: 3.5,
    // ... other fields
  }
];
```

## Environment Files

The mock data flag has been added to all environment files:

- `.env` - Main development environment
- `.env.localhost` - Local override
- `.env.production` - Production environment
- `.env.example` - Template for new developers

**Note:** In production, always keep `VITE_USE_MOCK_DATA=false`

## How It Works

The implementation uses a simple feature flag pattern:

1. **Feature flag** defined in `/src/utils/constants.js`:
```javascript
export const FEATURE_FLAGS = {
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true',
};
```

2. **Services check the flag** before making API calls:
```javascript
async getMarketingData(dateRange, filters) {
  if (FEATURE_FLAGS.USE_MOCK_DATA) {
    return MOCK_DATA.marketing; // Return mock data
  }

  // Otherwise make real API call
  const response = await api.get(API_ENDPOINTS.MARKETING, ...);
  return response.data;
}
```

3. **Mock data** is structured to match real API responses exactly

## Troubleshooting

### Mock data not appearing?

1. **Check the environment variable:**
   ```bash
   # In your terminal
   echo $VITE_USE_MOCK_DATA
   ```

2. **Restart the dev server** - Vite needs a restart to pick up .env changes:
   ```bash
   npm run dev
   ```

3. **Clear browser cache** or open in incognito mode

4. **Check the console** - Look for any errors in browser DevTools

### Still seeing API errors?

- Some services might not have mock data integrated yet
- Check that the service you're using is listed in "What Data is Mocked?" above
- Verify you're using the correct service method

### Want to test both mock and real data?

Use different browsers or browser profiles:
- Chrome Profile 1: Mock data enabled
- Chrome Profile 2: Real API calls

Or use different environment files:
```bash
# Development with mock data
cp .env.localhost .env
npm run dev

# Development with real API
cp .env.production .env
npm run dev
```

## Best Practices

1. **Always commit with mock data OFF** (false) in shared environment files
2. **Update mock data** when adding new fields to real data structures
3. **Keep mock data realistic** - use numbers and dates that make sense
4. **Test both modes** before deploying - ensure real API calls still work
5. **Document any limitations** if mock data doesn't cover all scenarios

## Files Modified

The following files were created or modified for this feature:

- ✅ `/src/utils/constants.js` - Added FEATURE_FLAGS
- ✅ `/src/utils/mockData.js` - All mock data definitions
- ✅ `/src/services/dataService.js` - Integrated mock data checks
- ✅ `/src/services/eioService.js` - Integrated mock data checks
- ✅ `/src/services/planningService.js` - Integrated mock data checks
- ✅ `.env` - Added VITE_USE_MOCK_DATA flag
- ✅ `.env.example` - Added VITE_USE_MOCK_DATA flag
- ✅ `.env.localhost` - Added VITE_USE_MOCK_DATA flag
- ✅ `.env.production` - Added VITE_USE_MOCK_DATA flag

## Support

If you encounter issues with mock data:

1. Check this documentation first
2. Review the mock data structure in `/src/utils/mockData.js`
3. Compare with real API response structure
4. Ask the team if you need help

---

**Happy developing with mock data!** 🚀
