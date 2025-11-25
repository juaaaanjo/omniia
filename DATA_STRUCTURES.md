# Omniia Business Analytics Platform - Data Structures

## Project Overview

**Omniia** is a comprehensive **Business Analytics & Planning Platform** with AI-powered insights. It's designed for businesses to analyze marketing campaigns, track finances, forecast revenue, and automatically generate strategic business plans.

### Business Model
- **Type**: SaaS Analytics Platform
- **Primary Focus**: Multi-channel marketing attribution, financial analysis, and AI-powered business planning
- **Key Users**: Marketing managers, finance teams, business strategists
- **Core Features**:
  - Marketing dashboard (Meta Ads, Google Ads integration)
  - Finance/revenue tracking
  - Cross-channel analytics and attribution
  - AI-powered planning with guardrails
  - Operational Intelligence (EIO) with alerts
  - Forecasting with LEARNS (learning from actual outcomes)

---

## 1. MARKETING DATA STRUCTURES

### Campaign Object
```javascript
{
  // Basic Info
  id: String,                    // Campaign ID
  _id: String,                   // MongoDB ID (alternative)
  campaignId: String,            // Alternative ID field
  name: String,                  // Campaign name
  campaignName: String,          // Alternative name field
  accountName: String,           // Associated account name
  
  // Performance Metrics
  totalSpend: Number,            // Total spend across period
  spend: Number,                 // Alternative spend field
  lifetimeSpend: Number,         // Alternative spend field
  
  totalImpressions: Number,      // Total ad impressions
  impressions: Number,           // Alternative impressions
  
  totalClicks: Number,           // Total clicks on ads
  clicks: Number,                // Alternative clicks field
  
  totalRevenue: Number,          // Revenue generated
  totalOrders: Number,           // Orders from campaign
  
  // Cost Metrics
  avgCPC: Number,                // Average cost per click
  maxCPC: Number,                // Maximum CPC
  
  // ROI Metrics
  roas: Number,                  // Return on Ad Spend
  totalROAS: Number,             // Alternative ROAS field
  avgROAS: Number,               // Alternative ROAS field
  
  // Daily/Budget Limits
  dailyBudget: Number,           // Daily budget allocation
  budget: {
    daily: Number
  },
  
  // Campaign Details
  status: String,                // ACTIVE | PAUSED | ARCHIVED | COMPLETED | UNKNOWN
  objective: String,             // Campaign objective
  adObjective: String,           // Alternative objective field
  currency: String,              // Currency code (default: USD)
  
  // CTR and Conversion Metrics
  minCTR: Number,                // Minimum click-through rate %
  ctr: Number,                   // Click-through rate %
  minConversions: Number         // Minimum conversion count
}
```

### Daily Spend Object
```javascript
{
  _id: Date,                     // Date identifier
  date: String,                  // Formatted date
  spend: Number,                 // Daily spend amount
  impressions: Number,           // Daily impressions
  clicks: Number,                // Daily clicks
  revenue: Number,               // Daily revenue (optional)
  orders: Number                 // Daily orders (optional)
}
```

### Marketing Summary
```javascript
{
  totalCampaigns: Number,        // Number of active campaigns
  avgROAS: Number,               // Average ROAS across campaigns
  topPerformer: {                // Best performing campaign
    campaignName: String,
    totalSpend: Number,
    totalImpressions: Number,
    totalClicks: Number,
    avgCPC: Number,
    roas: Number
  }
}
```

### Marketing Dashboard Response
```javascript
{
  data: {                        // or at root level
    campaigns: Array<Campaign>,
    dailySpend: Array<DailySpend>,
    summary: {
      totalCampaigns: Number,
      avgROAS: Number,
      topPerformer: Object
    },
    dateRange: {
      startDate: ISO String,
      endDate: ISO String
    }
  }
}
```

---

## 2. FINANCIAL/TRANSACTION DATA STRUCTURES

### Payment Data Object
```javascript
{
  totalRevenue: Number,          // Total revenue in period
  netRevenue: Number,            // Revenue after costs
  
  // Provider earnings (affiliate/commission)
  totalProviderEarnings: Number,
  
  // Alternative field names
  revenue: Number,
  costs: Number,                 // Total costs/expenses
  profit: Number,                // Net profit
  
  currency: String,              // Currency code (default: USD)
  dataSource: String             // Source of payment data
}
```

### Expense Category Object
```javascript
{
  category: String,              // Expense category name
  amount: Number,                // Amount in category
  
  // Alternative field names
  bucket: String,                // Bucket/category name (for aging)
  count: Number,                 // Number of items in bucket
  invoices: Number               // Number of invoices
}
```

### AR (Accounts Receivable) Aging Object
```javascript
{
  bucket: String,                // "current" | "30+" | "60+" | "90+" | "120+"
  amount: Number,                // Amount in aging bucket
  count: Number,                 // Number of invoices
  invoices: Number               // Alternative invoice count
}
```

### Revenue vs Costs Data
```javascript
{
  date: ISO String,
  revenue: Number,
  costs: Number,
  profit: Number
}
```

### Cash Flow Data
```javascript
{
  date: ISO String,
  inflow: Number,                // Money coming in
  outflow: Number                // Money going out
}
```

### Budget vs Actual Data
```javascript
{
  category: String,
  budget: Number,
  actual: Number
}
```

### Finance Summary
```javascript
{
  revenue: Number,
  expenses: Number,
  profit: Number,
  margin: Number                 // Profit margin percentage
}
```

### Finance Dashboard Response
```javascript
{
  summary: {
    revenue: Number,
    expenses: Number,
    profit: Number,
    margin: Number
  },
  paymentData: {
    totalRevenue: Number,
    netRevenue: Number,
    totalProviderEarnings: Number,
    currency: String
  },
  expensesByCategory: Array<{
    category: String,
    amount: Number
  }>,
  arAging: Array<{
    bucket: String,
    amount: Number,
    count: Number
  }>,
  revenueVsCosts: Array<{
    date: String,
    revenue: Number,
    costs: Number,
    profit: Number
  }>,
  cashFlow: Array<{
    date: String,
    inflow: Number,
    outflow: Number
  }>,
  budgetVsActual: Array<{
    category: String,
    budget: Number,
    actual: Number
  }>,
  dateRange: {
    startDate: ISO String,
    endDate: ISO String
  },
  paymentDataSource: String
}
```

---

## 3. GUARDRAIL (CAMPAIGN SAFETY) DATA STRUCTURES

### Guardrail Object
```javascript
{
  _id: String,                   // MongoDB ID
  campaignId: String,            // Associated campaign ID
  campaignName: String,          // Campaign name for reference
  
  // Performance Rules/Thresholds
  rules: {
    minROAS: Number,             // Minimum ROAS threshold
    maxCPA: Number,              // Maximum cost per acquisition
    maxDailySpend: Number,       // Maximum daily budget
    minCTR: Number,              // Minimum click-through rate %
    maxCPC: Number,              // Maximum cost per click
    minConversions: Number       // Minimum conversions required
  },
  
  // Automatic Actions
  autoActions: {
    autoPause: Boolean,          // Auto-pause if rules violated
    alertOnly: Boolean,          // Alert without auto action
    requireConfirmation: Boolean // Require manual approval before pause
  },
  
  // Monitoring Configuration
  monitoring: {
    enabled: Boolean,            // Is monitoring active?
    evaluationWindow: Number,    // Hours to evaluate (default: 24)
    minDataPoints: Number        // Min data points before action (default: 10)
  },
  
  // Metadata
  createdAt: ISO String,
  updatedAt: ISO String,
  status: String                 // Active/Paused
}
```

### Guardrail Form State
```javascript
{
  rules: {
    minROAS: Number | String,
    maxCPA: Number | String,
    maxDailySpend: Number | String,
    minCTR: Number | String,
    maxCPC: Number | String,
    minConversions: Number | String
  },
  autoActions: {
    autoPause: Boolean,
    alertOnly: Boolean,
    requireConfirmation: Boolean
  },
  monitoring: {
    enabled: Boolean,
    evaluationWindow: Number,
    minDataPoints: Number
  }
}
```

---

## 4. PLANNING DATA STRUCTURES (Auto-Generated Business Plans)

### Plan Object
```javascript
{
  _id: String,                   // Plan ID
  planId: String,                // Alternative ID
  
  // Basic Info
  planName: String,              // Plan name
  planType: String,              // revenue_growth | marketing_budget | customer_acquisition | roas_optimization | comprehensive
  description: String,           // Plan description
  
  // Status
  status: String,                // draft | active | completed | cancelled | archived
  
  // Goals
  goals: {
    primary: {
      metric: String,            // Metric to track (e.g., "Revenue", "Ad Spend")
      target: Number,            // Target value
      unit: String               // Unit (e.g., "USD", "%")
    },
    secondary: Array<{
      metric: String,
      target: Number,
      unit: String
    }>
  },
  
  // Progress Tracking
  progress: {
    overall: Number,             // 0-100 percentage complete
    milestones: Number,          // Completed milestones
    actions: Number              // Completed actions
  },
  
  // Action Items
  actionItems: Array<{
    _id: String,
    title: String,
    description: String,
    status: String,              // pending | in_progress | completed
    dueDate: ISO String,
    priority: String,            // high | medium | low
    assignee: String,
    estimatedImpact: Number      // Expected impact value
  }>,
  
  // Milestones
  milestones: Array<{
    _id: String,
    title: String,
    description: String,
    dueDate: ISO String,
    targetValue: Number,
    actualValue: Number,
    status: String               // pending | in_progress | completed
  }>,
  
  // Insights (why plan was created)
  insights: {
    reason: String,              // Why this plan was recommended
    opportunity: String,         // Identified opportunity
    riskMitigation: String      // Risks being addressed
  },
  
  // Timeline
  createdAt: ISO String,
  startDate: ISO String,
  endDate: ISO String,
  completedAt: ISO String (optional)
}
```

### Plan Statistics
```javascript
{
  totalPlans: Number,
  activePlans: Number,
  completedPlans: Number,
  draftPlans: Number,
  averageCompletionRate: Number,
  byType: {
    revenue_growth: Number,
    marketing_budget: Number,
    customer_acquisition: Number,
    roas_optimization: Number,
    comprehensive: Number
  }
}
```

### Action Item
```javascript
{
  _id: String,
  title: String,
  description: String,
  status: String,                // pending | in_progress | completed
  dueDate: ISO String,
  priority: String,              // high | medium | low
  assignee: String,
  estimatedImpact: Number,
  completedAt: ISO String (optional)
}
```

### Milestone
```javascript
{
  _id: String,
  title: String,
  description: String,
  dueDate: ISO String,
  targetValue: Number,
  actualValue: Number,
  status: String,                // pending | in_progress | completed
  completedAt: ISO String (optional)
}
```

---

## 5. OPERATIONAL INTELLIGENCE (EIO) DATA STRUCTURES

### Alert Object
```javascript
{
  _id: String,                   // Alert ID
  alertId: String,               // Alternative ID
  
  // Content
  title: String,                 // Alert title
  message: String,               // Alert message
  description: String,           // Detailed description
  
  // Categorization
  category: String,              // Category of alert
  type: String,                  // Alert type (e.g., performance, anomaly, opportunity)
  severity: String,              // critical | high | medium | low | info
  
  // Metrics Involved
  metric: String,                // Which metric this affects
  currentValue: Number,          // Current metric value
  expectedValue: Number,         // Expected/threshold value
  variance: Number,              // Variance from expected
  
  // Recommendations
  recommendation: String,        // Recommended action
  action: String,                // Specific action to take
  
  // Status
  status: String,                // pending | applied | ignored | reviewed | resolved
  
  // Additional Metadata
  source: String,                // Source of alert (meta_ads, finance, etc.)
  campaignId: String,            // Related campaign (if applicable)
  planId: String,                // Related plan (if applicable)
  
  // Timeline
  createdAt: ISO String,
  expiresAt: ISO String,
  resolvedAt: ISO String (optional),
  
  // Impact
  potentialImpact: String,       // Description of potential impact
  impactValue: Number,           // Quantified impact
  
  // Application
  appliedAt: ISO String,
  appliedBy: String,
  applicationDetails: Object
}
```

### Alerts Summary
```javascript
{
  total: Number,
  pending: Number,
  applied: Number,
  ignored: Number,
  criticalCount: Number,
  highCount: Number,
  mediumCount: Number,
  lowCount: Number,
  byCategory: {
    [categoryName]: Number,
    ...
  }
}
```

### Daily Insights
```javascript
{
  date: ISO String,
  summary: String,
  keyMetrics: {
    name: String,
    value: Number,
    change: Number,              // % change
    trend: String                // up | down | stable
  },
  alerts: Number,                // Number of alerts for this day
  recommendations: Array<String>,
  topPerformers: Array<{
    name: String,
    metric: String,
    value: Number
  }>,
  concerns: Array<{
    area: String,
    issue: String,
    severity: String
  }>
}
```

---

## 6. FORECASTING DATA STRUCTURES

### Forecast Object
```javascript
{
  _id: String,
  forecastId: String,
  
  // Configuration
  forecastType: String,          // revenue | ad_spend | customer_growth | roas | comprehensive
  forecastPeriod: String,        // next_week | next_month | next_quarter | custom
  customDays: Number,            // Days if custom period
  
  // Forecast Details
  startDate: ISO String,
  endDate: ISO String,
  
  // Results
  predictedValue: Number,        // Main forecast value
  confidenceLevel: Number,       // 0.2 to 0.95
  confidenceInterval: {
    lower: Number,
    upper: Number
  },
  
  // Analysis
  includeSeasonality: Boolean,
  seasonalityFactor: Number,
  trend: String,                 // increasing | decreasing | stable
  
  // Actual Results (LEARNS feature)
  actualValue: Number,           // Actual value that occurred
  accuracy: Number,              // Accuracy percentage
  notes: String,
  
  // Metadata
  createdAt: ISO String,
  recordedAt: ISO String,        // When actual was recorded
  status: String                 // pending | completed | archived
}
```

### Forecast Accuracy Statistics
```javascript
{
  totalForecasts: Number,
  completedForecasts: Number,
  averageAccuracy: Number,       // % accuracy
  byType: {
    revenue: {
      count: Number,
      avgAccuracy: Number
    },
    ad_spend: {
      count: Number,
      avgAccuracy: Number
    },
    // ... other types
  },
  accuracyTrend: Array<{
    period: String,
    accuracy: Number
  }>,
  improvements: String           // Improvement suggestions
}
```

### Scenario Analysis
```javascript
{
  _id: String,
  baseCase: {
    value: Number,
    probability: Number
  },
  bestCase: {
    value: Number,
    probability: Number,
    conditions: String
  },
  worstCase: {
    value: Number,
    probability: Number,
    conditions: String
  },
  expectedValue: Number
}
```

---

## 7. KPI DATA STRUCTURES

### KPI Object
```javascript
{
  // Core Business Metrics
  totalRevenue: Number,
  netProfit: Number,
  profitMargin: Number,
  
  // Marketing KPIs
  totalAdSpend: Number,
  totalImpressions: Number,
  totalClicks: Number,
  totalConversions: Number,
  avgROAS: Number,
  avgCPA: Number,
  
  // Customer Metrics
  totalCustomers: Number,
  newCustomers: Number,
  customerRetention: Number,
  customerLifetimeValue: Number,
  
  // Operational KPIs
  dataQuality: Number,           // Data completeness %
  syncStatus: String,            // Status of data sync
  
  // Attribution
  firstTouchROI: Number,
  lastTouchROI: Number,
  multiTouchROI: Number,
  
  dateRange: {
    startDate: ISO String,
    endDate: ISO String
  }
}
```

---

## 8. CROSS-ANALYSIS DATA STRUCTURES

### Attribution Data
```javascript
{
  channel: String,               // meta | google | organic | direct | etc
  firstTouchConversions: Number,
  lastTouchConversions: Number,
  multiTouchConversions: Number,
  revenue: Number,
  spend: Number,
  roi: Number
}
```

### Customer Metrics
```javascript
{
  cac: Number,                   // Customer Acquisition Cost
  ltv: Number,                   // Lifetime Value
  ltv_cac_ratio: Number,         // LTV:CAC ratio
  
  // By Channel
  byChannel: Array<{
    channel: String,
    cac: Number,
    ltv: Number
  }>
}
```

### Cohort Retention
```javascript
{
  cohort: String,                // Cohort identifier (week/month)
  size: Number,                  // Initial cohort size
  retention: Array<Number>,      // Retention % by period
  
  // By retention bucket
  day1: Number,
  day7: Number,
  day30: Number,
  day90: Number
}
```

---

## 9. COMMON DATA FIELDS

### Date Range Object
```javascript
{
  startDate: ISO String,
  endDate: ISO String
}
```

### Pagination Object
```javascript
{
  page: Number,
  limit: Number,
  total: Number,
  pages: Number,
  hasNext: Boolean,
  hasPrev: Boolean
}
```

### API Response Wrapper
```javascript
{
  data: Object | Array,          // Main data payload
  status: String,                // success | error
  message: String,
  pagination: Pagination (optional),
  dateRange: DateRange (optional),
  metadata: Object (optional)
}
```

---

## 10. KEY API ENDPOINTS

### Dashboard
- GET `/dashboard/kpis` - KPI data
- GET `/dashboard/marketing` - Marketing dashboard
- GET `/dashboard/finance` - Finance dashboard
- GET `/dashboard/cross-analysis` - Attribution & customer metrics

### Campaigns & Guardrails
- GET `/meta-ads/campaigns` - List campaigns
- POST `/meta-ads/campaigns/:campaignId/pause` - Pause campaign
- POST `/meta-ads/campaigns/:campaignId/activate` - Activate campaign
- GET `/guardrails` - List guardrails
- POST `/guardrails` - Create guardrail
- PUT `/guardrails/:id` - Update guardrail

### Planning
- GET `/planning` - List all plans
- GET `/planning/active` - Active plans only
- GET `/planning/:planId` - Plan details
- POST `/planning/analyze` - Trigger analysis
- PATCH `/planning/:planId/status` - Update plan status
- PATCH `/planning/:planId/actions/:actionId` - Update action item

### Forecasting
- GET `/forecasting/options` - Forecasting configuration
- POST `/forecasting/generate` - Generate forecast
- POST `/forecasting/scenarios` - Scenario analysis
- POST `/admin/forecasts/:id/actual` - Record actual results

### Operational Intelligence (EIO)
- GET `/eio/alerts` - List alerts
- GET `/eio/alerts/pending` - Pending alerts
- GET `/eio/alerts/summary` - Alerts summary
- POST `/eio/alerts/:id/apply` - Apply alert recommendation
- POST `/eio/alerts/:id/ignore` - Ignore alert

---

## 11. EXAMPLE DUMMY DATA

### Sample Campaign
```javascript
{
  _id: "123abc",
  campaignId: "1234567890",
  name: "Summer Sale 2024",
  campaignName: "Summer Sale 2024",
  accountName: "Primary Meta Account",
  
  totalSpend: 5000.50,
  totalImpressions: 250000,
  totalClicks: 12500,
  totalRevenue: 15000,
  totalOrders: 150,
  
  avgCPC: 0.40,
  roas: 3.0,
  
  dailyBudget: 200,
  status: "ACTIVE",
  objective: "CONVERSIONS",
  currency: "USD",
  
  minROAS: 2.0,
  minCTR: 1.5,
  minConversions: 50,
  
  createdAt: "2024-09-01T00:00:00Z"
}
```

### Sample Plan
```javascript
{
  _id: "plan_001",
  planName: "Q4 Revenue Growth Initiative",
  planType: "revenue_growth",
  description: "Strategic plan to increase Q4 revenue by 25%",
  status: "active",
  
  goals: {
    primary: {
      metric: "Revenue",
      target: 250000,
      unit: "USD"
    }
  },
  
  progress: {
    overall: 45,
    milestones: 2,
    actions: 5
  },
  
  actionItems: [
    {
      _id: "action_1",
      title: "Increase Meta Ad Spend",
      description: "Allocate additional budget to high-ROAS campaigns",
      status: "in_progress",
      dueDate: "2024-11-30T00:00:00Z",
      priority: "high",
      estimatedImpact: 50000
    }
  ],
  
  milestones: [
    {
      _id: "mile_1",
      title: "October Revenue Target",
      dueDate: "2024-10-31T00:00:00Z",
      targetValue: 75000,
      actualValue: 82000,
      status: "completed"
    }
  ],
  
  createdAt: "2024-09-15T00:00:00Z",
  startDate: "2024-10-01T00:00:00Z",
  endDate: "2024-12-31T00:00:00Z"
}
```

### Sample Guardrail
```javascript
{
  _id: "gr_001",
  campaignId: "1234567890",
  campaignName: "Summer Sale 2024",
  
  rules: {
    minROAS: 2.0,
    maxCPA: 50,
    maxDailySpend: 300,
    minCTR: 1.5,
    maxCPC: 0.75,
    minConversions: 10
  },
  
  autoActions: {
    autoPause: true,
    alertOnly: false,
    requireConfirmation: true
  },
  
  monitoring: {
    enabled: true,
    evaluationWindow: 24,
    minDataPoints: 10
  }
}
```

### Sample Alert
```javascript
{
  _id: "alert_001",
  title: "ROAS Below Threshold",
  message: "Campaign 'Summer Sale 2024' ROAS has dropped below 2.0x",
  description: "The campaign is currently performing at 1.8x ROAS, below your 2.0x guardrail threshold",
  
  category: "performance",
  severity: "high",
  
  metric: "ROAS",
  currentValue: 1.8,
  expectedValue: 2.0,
  variance: -10,
  
  recommendation: "Review ad creative and targeting. Consider pausing underperforming ad sets.",
  action: "Pause campaign",
  
  status: "pending",
  
  campaignId: "1234567890",
  source: "meta_ads",
  
  createdAt: "2024-11-10T10:30:00Z",
  expiresAt: "2024-11-11T10:30:00Z"
}
```

---

## Summary

This platform combines:
1. **Marketing Analytics**: Campaign performance tracking, Meta Ads integration
2. **Financial Management**: Revenue, expenses, profitability metrics
3. **Business Planning**: AI-generated plans with guardrails and KPI tracking
4. **Forecasting**: Revenue and metric predictions with accuracy learning
5. **Operational Intelligence**: Automated alerts and recommendations
6. **Attribution**: Multi-touch attribution for ROI calculation

All data is exposed through REST APIs and real-time WebSocket connections for live updates.
