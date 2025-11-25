/**
 * Omniia Platform - Dummy Data Examples
 * 
 * This file contains realistic example data structures that match the platform's
 * marketing, finance, planning, and operational intelligence systems.
 * 
 * Use these as templates to create your own test data.
 */

// ============================================================================
// 1. MARKETING DATA EXAMPLES
// ============================================================================

const dummyCampaigns = [
  {
    _id: "624a7e5f2b1c9e001a2b3c4d",
    id: "1234567890",
    campaignId: "1234567890",
    name: "Summer Sale 2024",
    campaignName: "Summer Sale 2024",
    accountName: "Primary Meta Account",
    
    // Performance metrics
    totalSpend: 5250.75,
    totalImpressions: 285000,
    totalClicks: 14250,
    totalRevenue: 18500,
    totalOrders: 185,
    
    // Cost metrics
    avgCPC: 0.368,
    maxCPC: 0.95,
    
    // ROI metrics
    roas: 3.52,
    
    // Budget
    dailyBudget: 250,
    budget: { daily: 250 },
    
    // Details
    status: "ACTIVE",
    objective: "CONVERSIONS",
    adObjective: "CONVERSIONS",
    currency: "COP",
    
    // CTR
    ctr: 4.99,
    minCTR: 1.5,
    minConversions: 50,
    
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2024-11-10T15:30:00Z"
  },
  {
    _id: "624a7e5f2b1c9e001a2b3c4e",
    id: "2345678901",
    campaignId: "2345678901",
    name: "Black Friday Promo",
    campaignName: "Black Friday Promo",
    accountName: "Primary Meta Account",
    
    totalSpend: 3750.00,
    totalImpressions: 195000,
    totalClicks: 8500,
    totalRevenue: 12000,
    totalOrders: 120,
    
    avgCPC: 0.441,
    roas: 3.2,
    
    dailyBudget: 200,
    status: "PAUSED",
    objective: "TRAFFIC",
    currency: "COP",
    
    ctr: 4.36,
    minCTR: 2.0,
    minConversions: 40,
    
    createdAt: "2024-10-15T00:00:00Z",
    updatedAt: "2024-11-09T10:20:00Z"
  },
  {
    _id: "624a7e5f2b1c9e001a2b3c4f",
    id: "3456789012",
    campaignId: "3456789012",
    name: "Product Launch - Category A",
    campaignName: "Product Launch - Category A",
    accountName: "Secondary Account",
    
    totalSpend: 2100.50,
    totalImpressions: 156000,
    totalClicks: 6200,
    totalRevenue: 7800,
    totalOrders: 65,
    
    avgCPC: 0.339,
    roas: 3.71,
    
    dailyBudget: 150,
    status: "ACTIVE",
    objective: "CONVERSIONS",
    currency: "COP",
    
    ctr: 3.97,
    minCTR: 2.5,
    minConversions: 30,
    
    createdAt: "2024-09-20T00:00:00Z"
  }
];

const dummyDailySpend = [
  {
    _id: new Date("2024-11-08"),
    date: "Nov 8",
    spend: 325.50,
    impressions: 18500,
    clicks: 925,
    revenue: 1150,
    orders: 12
  },
  {
    _id: new Date("2024-11-09"),
    date: "Nov 9",
    spend: 405.75,
    impressions: 21200,
    clicks: 1058,
    revenue: 1525,
    orders: 15
  },
  {
    _id: new Date("2024-11-10"),
    date: "Nov 10",
    spend: 382.25,
    impressions: 19800,
    clicks: 990,
    revenue: 1425,
    orders: 14
  }
];

const dummyMarketingResponse = {
  data: {
    campaigns: dummyCampaigns,
    dailySpend: dummyDailySpend,
    summary: {
      totalCampaigns: 3,
      avgROAS: 3.48,
      topPerformer: {
        campaignName: "Product Launch - Category A",
        totalSpend: 2100.50,
        totalImpressions: 156000,
        totalClicks: 6200,
        avgCPC: 0.339,
        roas: 3.71
      }
    },
    dateRange: {
      startDate: "2024-09-01T00:00:00Z",
      endDate: "2024-11-10T23:59:59Z"
    }
  }
};

// ============================================================================
// 2. FINANCE DATA EXAMPLES
// ============================================================================

const dummyFinanceResponse = {
  summary: {
    revenue: 45000,
    expenses: 15000,
    profit: 30000,
    margin: 66.67
  },
  paymentData: {
    totalRevenue: 45000,
    netRevenue: 38250,
    totalProviderEarnings: 6750,
    currency: "COP",
    dataSource: "Stripe"
  },
  expensesByCategory: [
    {
      category: "Ad Spend",
      amount: 8500
    },
    {
      category: "Operations",
      amount: 3200
    },
    {
      category: "Personnel",
      amount: 2500
    },
    {
      category: "Infrastructure",
      amount: 800
    }
  ],
  arAging: [
    {
      bucket: "current",
      amount: 12500,
      count: 8
    },
    {
      bucket: "30+",
      amount: 2300,
      count: 2
    },
    {
      bucket: "60+",
      amount: 800,
      count: 1
    }
  ],
  revenueVsCosts: [
    {
      date: "Oct 2024",
      revenue: 15000,
      costs: 5200,
      profit: 9800
    },
    {
      date: "Nov 2024",
      revenue: 30000,
      costs: 9800,
      profit: 20200
    }
  ],
  cashFlow: [
    {
      date: "Oct 2024",
      inflow: 15000,
      outflow: 5200
    },
    {
      date: "Nov 2024",
      inflow: 30000,
      outflow: 9800
    }
  ],
  budgetVsActual: [
    {
      category: "Total Revenue",
      budget: 40000,
      actual: 45000
    },
    {
      category: "Expenses",
      budget: 16000,
      actual: 15000
    }
  ],
  dateRange: {
    startDate: "2024-09-01T00:00:00Z",
    endDate: "2024-11-10T23:59:59Z"
  },
  paymentDataSource: "Stripe"
};

// ============================================================================
// 3. GUARDRAIL DATA EXAMPLES
// ============================================================================

const dummyGuardrails = [
  {
    _id: "gr_001_624a7e5f2b1c9e001a2b3c4d",
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
    },
    
    createdAt: "2024-09-01T10:00:00Z",
    updatedAt: "2024-11-10T15:30:00Z",
    status: "ACTIVE"
  },
  {
    _id: "gr_002_624a7e5f2b1c9e001a2b3c4e",
    campaignId: "2345678901",
    campaignName: "Black Friday Promo",
    
    rules: {
      minROAS: 2.5,
      maxCPA: 40,
      maxDailySpend: 250,
      minCTR: 2.0,
      maxCPC: 0.60,
      minConversions: 15
    },
    
    autoActions: {
      autoPause: false,
      alertOnly: true,
      requireConfirmation: false
    },
    
    monitoring: {
      enabled: true,
      evaluationWindow: 12,
      minDataPoints: 5
    },
    
    createdAt: "2024-10-15T14:20:00Z",
    status: "PAUSED"
  }
];

// ============================================================================
// 4. PLANNING DATA EXAMPLES
// ============================================================================

const dummyPlans = [
  {
    _id: "plan_001_624a7e5f2b1c9e001a2b3c4d",
    planName: "Q4 Revenue Growth Initiative",
    planType: "revenue_growth",
    description: "Strategic plan to increase Q4 revenue by 25% through optimized ad spend and improved targeting",
    status: "active",
    
    goals: {
      primary: {
        metric: "Revenue",
        target: 250000,
        unit: "COP"
      },
      secondary: [
        {
          metric: "Ad Spend",
          target: 40000,
          unit: "COP"
        },
        {
          metric: "ROAS",
          target: 3.5,
          unit: "x"
        }
      ]
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
        description: "Allocate additional 20k budget to high-ROAS campaigns based on historical performance",
        status: "in_progress",
        dueDate: "2024-11-30T00:00:00Z",
        priority: "high",
        assignee: "Maria Garcia",
        estimatedImpact: 50000
      },
      {
        _id: "action_2",
        title: "Optimize Campaign Targeting",
        description: "Refine audience segments and implement lookalike audiences",
        status: "completed",
        dueDate: "2024-11-15T00:00:00Z",
        priority: "high",
        assignee: "John Smith",
        estimatedImpact: 25000,
        completedAt: "2024-11-12T10:30:00Z"
      },
      {
        _id: "action_3",
        title: "Create New Ad Creatives",
        description: "Design 5 new ad variations for A/B testing",
        status: "pending",
        dueDate: "2024-11-20T00:00:00Z",
        priority: "medium",
        assignee: "Alex Rivera",
        estimatedImpact: 15000
      }
    ],
    
    milestones: [
      {
        _id: "mile_1",
        title: "October Revenue Target",
        description: "Achieve 75k revenue in October",
        dueDate: "2024-10-31T00:00:00Z",
        targetValue: 75000,
        actualValue: 82000,
        status: "completed"
      },
      {
        _id: "mile_2",
        title: "November Mid-Month Checkpoint",
        description: "Review progress and adjust strategy if needed",
        dueDate: "2024-11-15T00:00:00Z",
        targetValue: 125000,
        actualValue: 112500,
        status: "in_progress"
      }
    ],
    
    insights: {
      reason: "Analysis shows significant untapped potential in audience segment B with 3.8x ROAS potential",
      opportunity: "Increasing ad spend in Q4 holiday season could capture 25% more revenue",
      riskMitigation: "Guardrails will automatically pause if ROAS drops below 2.0x threshold"
    },
    
    createdAt: "2024-09-15T08:00:00Z",
    startDate: "2024-10-01T00:00:00Z",
    endDate: "2024-12-31T00:00:00Z"
  },
  {
    _id: "plan_002_624a7e5f2b1c9e001a2b3c4e",
    planName: "Customer Acquisition Acceleration",
    planType: "customer_acquisition",
    description: "Plan to acquire 500 new customers in Q4 with optimized CAC",
    status: "draft",
    
    goals: {
      primary: {
        metric: "New Customers",
        target: 500,
        unit: "units"
      }
    },
    
    progress: {
      overall: 0,
      milestones: 0,
      actions: 0
    },
    
    actionItems: [],
    milestones: [],
    
    createdAt: "2024-11-08T12:00:00Z",
    startDate: "2024-11-15T00:00:00Z",
    endDate: "2024-12-31T00:00:00Z"
  }
];

// ============================================================================
// 5. OPERATIONAL INTELLIGENCE (EIO) ALERTS
// ============================================================================

const dummyAlerts = [
  {
    _id: "alert_001_624a7e5f2b1c9e001a2b3c4d",
    title: "ROAS Below Guardrail Threshold",
    message: "Campaign 'Summer Sale 2024' ROAS dropped to 1.95x, below your 2.0x guardrail",
    description: "The campaign is currently performing at 1.95x ROAS, which is below your minimum 2.0x threshold. This may indicate declining ad effectiveness or audience fatigue.",
    
    category: "performance",
    severity: "high",
    type: "performance",
    
    metric: "ROAS",
    currentValue: 1.95,
    expectedValue: 2.0,
    variance: -2.5,
    
    recommendation: "Review ad creative, pause underperforming ad sets, and consider refreshing audience segments",
    action: "Pause campaign",
    
    status: "pending",
    
    campaignId: "1234567890",
    source: "meta_ads",
    
    potentialImpact: "Risk of wasted ad spend if campaign continues at current ROAS",
    impactValue: 500,
    
    createdAt: "2024-11-10T14:30:00Z",
    expiresAt: "2024-11-12T14:30:00Z"
  },
  {
    _id: "alert_002_624a7e5f2b1c9e001a2b3c4e",
    title: "Anomaly: Revenue Spike Detected",
    message: "Revenue increased 40% compared to 7-day average",
    description: "Unusual spike in revenue detected. This could indicate a viral moment, successful promotion, or data anomaly.",
    
    category: "anomaly",
    severity: "info",
    type: "anomaly",
    
    metric: "Revenue",
    currentValue: 2500,
    expectedValue: 1786,
    variance: 40,
    
    recommendation: "Investigate the cause of revenue spike to replicate success",
    action: "Analyze traffic sources",
    
    status: "pending",
    
    source: "finance",
    
    potentialImpact: "Opportunity to understand what drove the spike and replicate it",
    impactValue: 10000,
    
    createdAt: "2024-11-10T10:15:00Z",
    expiresAt: "2024-11-13T10:15:00Z"
  },
  {
    _id: "alert_003_624a7e5f2b1c9e001a2b3c4f",
    title: "CPA Exceeds Threshold",
    message: "Customer Acquisition Cost reached 55 COP, exceeding the 50 COP limit",
    description: "The cost to acquire a new customer has increased, which may impact profitability and campaign efficiency.",
    
    category: "performance",
    severity: "medium",
    type: "performance",
    
    metric: "CPA",
    currentValue: 55,
    expectedValue: 50,
    variance: 10,
    
    recommendation: "Optimize audience targeting to reduce acquisition cost, or adjust bid strategy",
    action: "Review audience segments",
    
    status: "applied",
    appliedAt: "2024-11-10T16:00:00Z",
    appliedBy: "admin",
    
    campaignId: "3456789012",
    source: "meta_ads",
    
    createdAt: "2024-11-10T15:45:00Z",
    expiresAt: "2024-11-11T15:45:00Z"
  }
];

const dummyAlertsSummary = {
  total: 12,
  pending: 5,
  applied: 4,
  ignored: 3,
  criticalCount: 0,
  highCount: 3,
  mediumCount: 5,
  lowCount: 4,
  byCategory: {
    performance: 7,
    anomaly: 2,
    opportunity: 2,
    system: 1
  }
};

// ============================================================================
// 6. FORECASTING DATA
// ============================================================================

const dummyForecasts = [
  {
    _id: "forecast_001_624a7e5f2b1c9e001a2b3c4d",
    forecastType: "revenue",
    forecastPeriod: "next_month",
    
    startDate: "2024-11-10T00:00:00Z",
    endDate: "2024-12-10T00:00:00Z",
    
    predictedValue: 120000,
    confidenceLevel: 0.85,
    confidenceInterval: {
      lower: 102000,
      upper: 138000
    },
    
    includeSeasonality: true,
    seasonalityFactor: 1.25,
    trend: "increasing",
    
    actualValue: 125000,
    accuracy: 92,
    notes: "Forecast was slightly conservative. Black Friday impact greater than expected.",
    
    createdAt: "2024-11-05T10:00:00Z",
    recordedAt: "2024-12-11T09:30:00Z",
    status: "completed"
  },
  {
    _id: "forecast_002_624a7e5f2b1c9e001a2b3c4e",
    forecastType: "ad_spend",
    forecastPeriod: "next_month",
    
    startDate: "2024-11-10T00:00:00Z",
    endDate: "2024-12-10T00:00:00Z",
    
    predictedValue: 35000,
    confidenceLevel: 0.78,
    confidenceInterval: {
      lower: 29750,
      upper: 40250
    },
    
    includeSeasonality: true,
    seasonalityFactor: 1.15,
    trend: "increasing",
    
    createdAt: "2024-11-05T10:30:00Z",
    status: "pending"
  }
];

const dummyForecastAccuracyStats = {
  totalForecasts: 12,
  completedForecasts: 8,
  averageAccuracy: 87.5,
  byType: {
    revenue: {
      count: 5,
      avgAccuracy: 89.2
    },
    ad_spend: {
      count: 3,
      avgAccuracy: 85.8
    },
    customer_growth: {
      count: 2,
      avgAccuracy: 84.5
    },
    roas: {
      count: 2,
      avgAccuracy: 86.0
    }
  },
  accuracyTrend: [
    { period: "Sep 2024", accuracy: 82.5 },
    { period: "Oct 2024", accuracy: 87.0 },
    { period: "Nov 2024", accuracy: 91.5 }
  ],
  improvements: "Recent forecasts show improving accuracy. Consider increasing confidence levels for next month predictions."
};

// ============================================================================
// 7. KPI DATA
// ============================================================================

const dummyKPIs = {
  // Core Business Metrics
  totalRevenue: 180000,
  netProfit: 120000,
  profitMargin: 66.67,
  
  // Marketing KPIs
  totalAdSpend: 28000,
  totalImpressions: 1250000,
  totalClicks: 62500,
  totalConversions: 625,
  avgROAS: 3.48,
  avgCPA: 44.8,
  
  // Customer Metrics
  totalCustomers: 2500,
  newCustomers: 185,
  customerRetention: 78.5,
  customerLifetimeValue: 720,
  
  // Operational KPIs
  dataQuality: 94.2,
  syncStatus: "SYNCED",
  
  // Attribution
  firstTouchROI: 2.8,
  lastTouchROI: 3.2,
  multiTouchROI: 3.48,
  
  dateRange: {
    startDate: "2024-09-01T00:00:00Z",
    endDate: "2024-11-10T23:59:59Z"
  }
};

// ============================================================================
// 8. CROSS-ANALYSIS DATA
// ============================================================================

const dummyCrossAnalysisData = {
  attribution: [
    {
      channel: "meta",
      firstTouchConversions: 150,
      lastTouchConversions: 280,
      multiTouchConversions: 320,
      revenue: 125000,
      spend: 18000,
      roi: 6.94
    },
    {
      channel: "google",
      firstTouchConversions: 120,
      lastTouchConversions: 200,
      multiTouchConversions: 220,
      revenue: 85000,
      spend: 8500,
      roi: 10.0
    },
    {
      channel: "organic",
      firstTouchConversions: 80,
      lastTouchConversions: 120,
      multiTouchConversions: 85,
      revenue: 42000,
      spend: 1500,
      roi: 28.0
    }
  ],
  
  customerMetrics: {
    cac: 44.8,
    ltv: 720,
    ltv_cac_ratio: 16.07,
    byChannel: [
      { channel: "meta", cac: 56.25, ltv: 625 },
      { channel: "google", cac: 38.64, ltv: 750 },
      { channel: "organic", cac: 8.11, ltv: 900 }
    ]
  },
  
  cohortRetention: [
    {
      cohort: "2024-09",
      size: 280,
      retention: [100, 95, 88, 82, 78, 75, 72],
      day1: 100,
      day7: 95,
      day30: 88,
      day90: 75
    },
    {
      cohort: "2024-10",
      size: 350,
      retention: [100, 96, 89, 85, 81],
      day1: 100,
      day7: 96,
      day30: 89,
      day90: null
    }
  ]
};

// ============================================================================
// EXPORT ALL DUMMY DATA
// ============================================================================

const dummyData = {
  // Marketing
  campaigns: dummyCampaigns,
  dailySpend: dummyDailySpend,
  marketingResponse: dummyMarketingResponse,
  
  // Finance
  financeResponse: dummyFinanceResponse,
  
  // Guardrails
  guardrails: dummyGuardrails,
  
  // Planning
  plans: dummyPlans,
  
  // EIO
  alerts: dummyAlerts,
  alertsSummary: dummyAlertsSummary,
  
  // Forecasting
  forecasts: dummyForecasts,
  forecastAccuracyStats: dummyForecastAccuracyStats,
  
  // KPIs
  kpis: dummyKPIs,
  
  // Cross-Analysis
  crossAnalysisData: dummyCrossAnalysisData
};

// If using as Node module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = dummyData;
}
