/**
 * Omniia Platform - Mock Data for Development & Testing
 *
 * This file contains realistic example data structures that match the platform's
 * marketing, finance, planning, and operational intelligence systems.
 *
 * Controlled by VITE_USE_MOCK_DATA environment variable
 */

// ============================================================================
// 1. MARKETING DATA
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

    createdAt: "2024-09-20T00:00:00Z",
    updatedAt: "2024-11-10T12:00:00Z"
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
};

// ============================================================================
// 2. FINANCE DATA
// ============================================================================

// Individual transactions for detailed views
const dummyTransactions = [
  { _id: "tx_001", date: "2024-11-10", amount: 125000, type: "sale", category: "Product Sales", customer: "Enterprise Client A", status: "completed" },
  { _id: "tx_002", date: "2024-11-10", amount: 85000, type: "sale", category: "Service Revenue", customer: "Mid-Market Client B", status: "completed" },
  { _id: "tx_003", date: "2024-11-10", amount: 45000, type: "sale", category: "Product Sales", customer: "SMB Client C", status: "completed" },
  { _id: "tx_004", date: "2024-11-10", amount: 32000, type: "expense", category: "Ad Spend", vendor: "Meta Ads", status: "paid" },
  { _id: "tx_005", date: "2024-11-09", amount: 210000, type: "sale", category: "Product Sales", customer: "Enterprise Client D", status: "completed" },
  { _id: "tx_006", date: "2024-11-09", amount: 95000, type: "sale", category: "Service Revenue", customer: "Enterprise Client A", status: "completed" },
  { _id: "tx_007", date: "2024-11-09", amount: 28000, type: "expense", category: "Ad Spend", vendor: "Google Ads", status: "paid" },
  { _id: "tx_008", date: "2024-11-08", amount: 175000, type: "sale", category: "Product Sales", customer: "Mid-Market Client E", status: "completed" },
  { _id: "tx_009", date: "2024-11-08", amount: 65000, type: "sale", category: "Subscription", customer: "SMB Client F", status: "completed" },
  { _id: "tx_010", date: "2024-11-08", amount: 42000, type: "expense", category: "Personnel", vendor: "Payroll", status: "paid" },
  { _id: "tx_011", date: "2024-11-07", amount: 190000, type: "sale", category: "Product Sales", customer: "Enterprise Client G", status: "completed" },
  { _id: "tx_012", date: "2024-11-07", amount: 78000, type: "sale", category: "Service Revenue", customer: "Mid-Market Client H", status: "completed" },
  { _id: "tx_013", date: "2024-11-06", amount: 155000, type: "sale", category: "Product Sales", customer: "Enterprise Client I", status: "completed" },
  { _id: "tx_014", date: "2024-11-06", amount: 35000, type: "expense", category: "Operations", vendor: "Infrastructure Costs", status: "paid" },
  { _id: "tx_015", date: "2024-11-05", amount: 225000, type: "sale", category: "Product Sales", customer: "Enterprise Client J", status: "completed" },
  { _id: "tx_016", date: "2024-11-05", amount: 88000, type: "sale", category: "Service Revenue", customer: "Mid-Market Client K", status: "completed" },
  { _id: "tx_017", date: "2024-11-04", amount: 145000, type: "sale", category: "Product Sales", customer: "SMB Client L", status: "completed" },
  { _id: "tx_018", date: "2024-11-04", amount: 58000, type: "sale", category: "Subscription", customer: "Mid-Market Client M", status: "completed" },
  { _id: "tx_019", date: "2024-11-03", amount: 198000, type: "sale", category: "Product Sales", customer: "Enterprise Client N", status: "completed" },
  { _id: "tx_020", date: "2024-11-03", amount: 72000, type: "sale", category: "Service Revenue", customer: "SMB Client O", status: "completed" },
  { _id: "tx_021", date: "2024-11-02", amount: 165000, type: "sale", category: "Product Sales", customer: "Enterprise Client P", status: "completed" },
  { _id: "tx_022", date: "2024-11-02", amount: 45000, type: "expense", category: "Ad Spend", vendor: "Meta Ads", status: "paid" },
  { _id: "tx_023", date: "2024-11-01", amount: 235000, type: "sale", category: "Product Sales", customer: "Enterprise Client Q", status: "completed" },
  { _id: "tx_024", date: "2024-11-01", amount: 92000, type: "sale", category: "Service Revenue", customer: "Mid-Market Client R", status: "completed" },
  { _id: "tx_025", date: "2024-10-31", amount: 185000, type: "sale", category: "Product Sales", customer: "Enterprise Client S", status: "completed" },
];

const dummyFinanceResponse = {
  summary: {
    revenue: 2850000,
    expenses: 985000,
    profit: 1865000,
    margin: 65.44
  },
  paymentData: {
    totalRevenue: 2850000,
    netRevenue: 2422500,
    totalProviderEarnings: 427500,
    currency: "COP",
    dataSource: "Stripe"
  },
  transactions: dummyTransactions,
  expensesByCategory: [
    {
      category: "Ad Spend",
      amount: 485000
    },
    {
      category: "Operations",
      amount: 225000
    },
    {
      category: "Personnel",
      amount: 195000
    },
    {
      category: "Infrastructure",
      amount: 80000
    }
  ],
  arAging: [
    {
      bucket: "current",
      amount: 825000,
      count: 45
    },
    {
      bucket: "30+",
      amount: 185000,
      count: 12
    },
    {
      bucket: "60+",
      amount: 95000,
      count: 5
    },
    {
      bucket: "90+",
      amount: 42000,
      count: 3
    }
  ],
  revenueVsCosts: [
    { date: "Jul 2024", revenue: 1850000, costs: 725000, profit: 1125000 },
    { date: "Aug 2024", revenue: 2150000, costs: 825000, profit: 1325000 },
    { date: "Sep 2024", revenue: 2450000, costs: 895000, profit: 1555000 },
    { date: "Oct 2024", revenue: 2650000, costs: 925000, profit: 1725000 },
    { date: "Nov 2024", revenue: 2850000, costs: 985000, profit: 1865000 }
  ],
  cashFlow: [
    { date: "Jul 2024", inflow: 1850000, outflow: 725000 },
    { date: "Aug 2024", inflow: 2150000, outflow: 825000 },
    { date: "Sep 2024", inflow: 2450000, outflow: 895000 },
    { date: "Oct 2024", inflow: 2650000, outflow: 925000 },
    { date: "Nov 2024", inflow: 2850000, outflow: 985000 }
  ],
  budgetVsActual: [
    {
      category: "Total Revenue",
      budget: 2500000,
      actual: 2850000
    },
    {
      category: "Expenses",
      budget: 1100000,
      actual: 985000
    }
  ],
  dateRange: {
    startDate: "2024-09-01T00:00:00Z",
    endDate: "2024-11-10T23:59:59Z"
  },
  paymentDataSource: "Stripe"
};

// ============================================================================
// 3. GUARDRAIL DATA
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
    updatedAt: "2024-11-08T08:45:00Z",
    status: "PAUSED"
  }
];

// ============================================================================
// 4. PLANNING DATA
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
        target: 3500000,
        unit: "COP"
      },
      secondary: [
        {
          metric: "Ad Spend",
          target: 650000,
          unit: "COP"
        },
        {
          metric: "ROAS",
          target: 4.2,
          unit: "x"
        }
      ]
    },

    progress: {
      overall: 68,
      milestones: 3,
      actions: 8
    },

    actionItems: [
      {
        _id: "action_1",
        title: "Increase Meta Ad Spend by 35%",
        description: "Allocate additional 225k budget to high-ROAS campaigns based on historical performance",
        status: "completed",
        dueDate: "2024-11-15T00:00:00Z",
        priority: "high",
        assignee: "Maria Garcia",
        estimatedImpact: 850000,
        completedAt: "2024-11-12T10:30:00Z"
      },
      {
        _id: "action_2",
        title: "Optimize Campaign Targeting for Premium Segments",
        description: "Refine audience segments and implement lookalike audiences targeting high-value customers",
        status: "completed",
        dueDate: "2024-11-10T00:00:00Z",
        priority: "high",
        assignee: "John Smith",
        estimatedImpact: 425000,
        completedAt: "2024-11-09T14:20:00Z"
      },
      {
        _id: "action_3",
        title: "Launch 15 New Ad Creative Variations",
        description: "Design and test 15 new ad variations focusing on Q4 holiday themes",
        status: "in_progress",
        dueDate: "2024-11-25T00:00:00Z",
        priority: "high",
        assignee: "Alex Rivera",
        estimatedImpact: 320000
      },
      {
        _id: "action_4",
        title: "Implement Retargeting Campaign",
        description: "Create retargeting campaigns for cart abandoners and past purchasers",
        status: "in_progress",
        dueDate: "2024-11-30T00:00:00Z",
        priority: "medium",
        assignee: "Sarah Chen",
        estimatedImpact: 275000
      },
      {
        _id: "action_5",
        title: "Expand to Google Shopping Ads",
        description: "Launch product catalog on Google Shopping with 150k budget",
        status: "pending",
        dueDate: "2024-12-05T00:00:00Z",
        priority: "medium",
        assignee: "Michael Torres",
        estimatedImpact: 380000
      }
    ],

    milestones: [
      {
        _id: "mile_1",
        title: "October Revenue Milestone",
        description: "Achieve 2.65M revenue in October",
        dueDate: "2024-10-31T00:00:00Z",
        targetValue: 2650000,
        actualValue: 2650000,
        status: "completed"
      },
      {
        _id: "mile_2",
        title: "November Mid-Month Checkpoint",
        description: "Reach 2.85M revenue by mid-November",
        dueDate: "2024-11-15T00:00:00Z",
        targetValue: 2850000,
        actualValue: 2850000,
        status: "completed"
      },
      {
        _id: "mile_3",
        title: "End of November Target",
        description: "Hit 3.2M revenue by end of November",
        dueDate: "2024-11-30T00:00:00Z",
        targetValue: 3200000,
        actualValue: null,
        status: "in_progress"
      }
    ],

    insights: {
      reason: "Analysis shows significant untapped potential in premium customer segment with 4.5x ROAS potential",
      opportunity: "Increasing ad spend in Q4 holiday season could capture an additional 1.2M in revenue",
      riskMitigation: "Guardrails will automatically pause if ROAS drops below 2.5x threshold"
    },

    createdAt: "2024-09-15T08:00:00Z",
    startDate: "2024-10-01T00:00:00Z",
    endDate: "2024-12-31T00:00:00Z"
  },
  {
    _id: "plan_002_624a7e5f2b1c9e001a2b3c4e",
    planName: "Customer Acquisition Acceleration",
    planType: "customer_acquisition",
    description: "Aggressive plan to acquire 1,200 new customers in Q4 with optimized CAC under 85k COP",
    status: "active",

    goals: {
      primary: {
        metric: "New Customers",
        target: 1200,
        unit: "units"
      },
      secondary: [
        {
          metric: "CAC",
          target: 85000,
          unit: "COP"
        },
        {
          metric: "LTV/CAC Ratio",
          target: 4.5,
          unit: "x"
        }
      ]
    },

    progress: {
      overall: 42,
      milestones: 2,
      actions: 6
    },

    actionItems: [
      {
        _id: "action_6",
        title: "Launch Referral Program",
        description: "Implement customer referral program with 25k incentives per successful referral",
        status: "in_progress",
        dueDate: "2024-11-20T00:00:00Z",
        priority: "high",
        assignee: "Laura Martinez",
        estimatedImpact: 180000
      },
      {
        _id: "action_7",
        title: "Optimize Landing Pages",
        description: "A/B test 8 landing page variations to improve conversion rate by 15%",
        status: "completed",
        dueDate: "2024-11-05T00:00:00Z",
        priority: "high",
        assignee: "David Kim",
        estimatedImpact: 220000,
        completedAt: "2024-11-04T16:45:00Z"
      },
      {
        _id: "action_8",
        title: "Expand Influencer Partnerships",
        description: "Partner with 10 micro-influencers in target segments",
        status: "pending",
        dueDate: "2024-12-01T00:00:00Z",
        priority: "medium",
        assignee: "Emma Wilson",
        estimatedImpact: 195000
      }
    ],

    milestones: [
      {
        _id: "mile_4",
        title: "First 400 Customers",
        description: "Acquire first 400 new customers",
        dueDate: "2024-11-10T00:00:00Z",
        targetValue: 400,
        actualValue: 425,
        status: "completed"
      },
      {
        _id: "mile_5",
        title: "Mid-Quarter Milestone",
        description: "Reach 800 total new customers",
        dueDate: "2024-11-25T00:00:00Z",
        targetValue: 800,
        actualValue: null,
        status: "in_progress"
      }
    ],

    insights: {
      reason: "Current CAC of 95k is above target; opportunity to reduce through better targeting",
      opportunity: "Landing page optimization showing 18% conversion improvement in tests",
      riskMitigation: "Referral program can reduce CAC by estimated 30% based on industry benchmarks"
    },

    createdAt: "2024-10-20T12:00:00Z",
    startDate: "2024-11-01T00:00:00Z",
    endDate: "2024-12-31T00:00:00Z"
  },
  {
    _id: "plan_003_624a7e5f2b1c9e001a2b3c4f",
    planName: "Retention & LTV Maximization",
    planType: "retention",
    description: "Improve customer retention rate from 78% to 85% and increase LTV by 35%",
    status: "active",

    goals: {
      primary: {
        metric: "Retention Rate",
        target: 85,
        unit: "%"
      },
      secondary: [
        {
          metric: "Customer LTV",
          target: 975000,
          unit: "COP"
        },
        {
          metric: "Repeat Purchase Rate",
          target: 45,
          unit: "%"
        }
      ]
    },

    progress: {
      overall: 35,
      milestones: 2,
      actions: 5
    },

    actionItems: [
      {
        _id: "action_9",
        title: "Launch Email Nurture Campaign",
        description: "Create 12-touch email sequence for onboarding and engagement",
        status: "in_progress",
        dueDate: "2024-11-18T00:00:00Z",
        priority: "high",
        assignee: "Rachel Green",
        estimatedImpact: 285000
      },
      {
        _id: "action_10",
        title: "Implement Loyalty Program",
        description: "Roll out tiered loyalty program with exclusive benefits",
        status: "pending",
        dueDate: "2024-12-10T00:00:00Z",
        priority: "high",
        assignee: "Tom Anderson",
        estimatedImpact: 420000
      }
    ],

    milestones: [
      {
        _id: "mile_6",
        title: "Retention Improvement Phase 1",
        description: "Increase retention to 81%",
        dueDate: "2024-11-30T00:00:00Z",
        targetValue: 81,
        actualValue: null,
        status: "in_progress"
      }
    ],

    insights: {
      reason: "Cohort analysis reveals 22% drop-off after first purchase; significant retention opportunity",
      opportunity: "Email nurture campaigns showing 12% improvement in repeat purchase in test group",
      riskMitigation: "Loyalty program ROI typically positive within 90 days based on industry data"
    },

    createdAt: "2024-10-25T09:30:00Z",
    startDate: "2024-11-01T00:00:00Z",
    endDate: "2025-01-31T00:00:00Z"
  },
  {
    _id: "plan_004_624a7e5f2b1c9e001a2b3c50",
    planName: "Product Line Expansion - Premium Tier",
    planType: "product_expansion",
    description: "Launch premium product tier targeting enterprise customers with 45% higher margins",
    status: "draft",

    goals: {
      primary: {
        metric: "Premium Revenue",
        target: 850000,
        unit: "COP"
      },
      secondary: [
        {
          metric: "Premium Customers",
          target: 35,
          unit: "units"
        },
        {
          metric: "Average Deal Size",
          target: 245000,
          unit: "COP"
        }
      ]
    },

    progress: {
      overall: 15,
      milestones: 1,
      actions: 4
    },

    actionItems: [
      {
        _id: "action_11",
        title: "Complete Product Development",
        description: "Finalize premium tier features and pricing strategy",
        status: "in_progress",
        dueDate: "2024-12-01T00:00:00Z",
        priority: "critical",
        assignee: "Product Team",
        estimatedImpact: 850000
      },
      {
        _id: "action_12",
        title: "Create Sales Collateral",
        description: "Develop case studies, pitch decks, and demo materials",
        status: "pending",
        dueDate: "2024-12-08T00:00:00Z",
        priority: "high",
        assignee: "Marketing Team",
        estimatedImpact: 0
      }
    ],

    milestones: [
      {
        _id: "mile_7",
        title: "Product Launch",
        description: "Launch premium tier to market",
        dueDate: "2024-12-15T00:00:00Z",
        targetValue: 1,
        actualValue: null,
        status: "pending"
      }
    ],

    insights: {
      reason: "Market research shows demand for premium enterprise solution with managed services",
      opportunity: "35 qualified enterprise leads in pipeline ready for premium offering",
      riskMitigation: "Pilot program with 5 beta customers validates pricing and value proposition"
    },

    createdAt: "2024-11-01T14:00:00Z",
    startDate: "2024-11-15T00:00:00Z",
    endDate: "2025-02-28T00:00:00Z"
  },
  {
    _id: "plan_005_624a7e5f2b1c9e001a2b3c51",
    planName: "Operational Efficiency Initiative",
    planType: "cost_optimization",
    description: "Reduce operational costs by 18% while maintaining service quality",
    status: "completed",

    goals: {
      primary: {
        metric: "Cost Reduction",
        target: 180000,
        unit: "COP"
      },
      secondary: [
        {
          metric: "Process Automation",
          target: 70,
          unit: "%"
        }
      ]
    },

    progress: {
      overall: 100,
      milestones: 3,
      actions: 7
    },

    actionItems: [
      {
        _id: "action_13",
        title: "Automate Reporting Workflows",
        description: "Implement automated reporting for all key metrics",
        status: "completed",
        dueDate: "2024-10-15T00:00:00Z",
        priority: "high",
        assignee: "Engineering Team",
        estimatedImpact: 85000,
        completedAt: "2024-10-12T11:00:00Z"
      },
      {
        _id: "action_14",
        title: "Renegotiate Vendor Contracts",
        description: "Consolidate vendors and negotiate better rates",
        status: "completed",
        dueDate: "2024-10-30T00:00:00Z",
        priority: "high",
        assignee: "Finance Team",
        estimatedImpact: 95000,
        completedAt: "2024-10-28T09:30:00Z"
      }
    ],

    milestones: [
      {
        _id: "mile_8",
        title: "Phase 1 - Quick Wins",
        description: "Achieve 60k in cost savings",
        dueDate: "2024-10-15T00:00:00Z",
        targetValue: 60000,
        actualValue: 75000,
        status: "completed"
      },
      {
        _id: "mile_9",
        title: "Phase 2 - Automation",
        description: "Reach 120k total savings",
        dueDate: "2024-10-31T00:00:00Z",
        targetValue: 120000,
        actualValue: 145000,
        status: "completed"
      },
      {
        _id: "mile_10",
        title: "Final Target",
        description: "Hit 180k cost reduction",
        dueDate: "2024-11-10T00:00:00Z",
        targetValue: 180000,
        actualValue: 195000,
        status: "completed"
      }
    ],

    insights: {
      reason: "Exceeded cost reduction target by 8% through vendor consolidation",
      opportunity: "Automation efforts unlocked additional 25k in savings beyond original target",
      riskMitigation: "Service quality metrics remained stable or improved throughout initiative"
    },

    createdAt: "2024-09-01T08:00:00Z",
    startDate: "2024-09-15T00:00:00Z",
    endDate: "2024-11-10T00:00:00Z"
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

const dummyAlertsByCategory = [
  { category: "performance", count: 7 },
  { category: "anomaly", count: 2 },
  { category: "opportunity", count: 2 },
  { category: "system", count: 1 }
];

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
  // Marketing KPIs
  marketing: {
    roas: 3.48,
    cpc: 0.368,
    ctr: 0.0499, // 4.99% as decimal
    totalAdSpend: 28000,
    totalImpressions: 1250000,
    totalClicks: 62500,
    totalConversions: 625,
    roasChange: 8.5,
    cpcChange: -12.3,
    ctrChange: 5.2
  },

  // Finance KPIs
  finance: {
    revenue: 2850000,
    margin: 65.44,
    totalCosts: 985000,
    profit: 1865000,
    revenueChange: 7.5,
    marginChange: 2.3,
    costsChange: -5.8
  },

  // Revenue/Payments KPIs
  payments: {
    totalRevenue: 2850000,
    netRevenue: 2422500,
    totalProviderEarnings: 427500,
    currency: "COP",
    dataSource: "Stripe"
  },

  revenue: {
    total: 2850000,
    growth: 7.5,
    monthlyRecurring: 950000
  },

  // Customer Metrics
  customers: {
    total: 3733,
    new: 425,
    retention: 78.5,
    lifetimeValue: 720000,
    churnRate: 8.2
  },

  // Operational KPIs
  dataQuality: 94.2,
  syncStatus: "SYNCED",

  // Attribution
  attribution: {
    firstTouchROI: 2.8,
    lastTouchROI: 3.2,
    multiTouchROI: 3.48
  },

  dateRange: {
    startDate: "2024-09-01T00:00:00Z",
    endDate: "2024-11-10T23:59:59Z"
  }
};

// ============================================================================
// 8. CROSS-ANALYSIS DATA
// ============================================================================

const dummyCrossAnalysisData = {
  // Revenue vs Spend Summary (for summary cards)
  revenueVsSpend: {
    totalSpend: 485000,
    totalRevenue: 2850000,
    roas: 5.88,
    netProfit: 1865000,
    impressions: 1250000,
    orderCount: 3733,
    clicks: 62500
  },

  // Campaign Performance (for charts and tables)
  campaignPerformance: {
    totalCampaigns: 3,
    bestPerformer: {
      campaignName: "Product Launch - Category A",
      totalSpend: 2100.50,
      totalImpressions: 156000,
      totalClicks: 6200,
      avgCPC: 0.339,
      roas: 3.71,
      totalRevenue: 7800
    },
    campaigns: dummyCampaigns.map(c => ({
      _id: c._id,
      campaignName: c.name,
      totalSpend: c.totalSpend,
      totalRevenue: c.totalRevenue,
      totalImpressions: c.totalImpressions,
      totalClicks: c.totalClicks,
      avgCPC: c.avgCPC,
      roas: c.roas
    }))
  },

  // Customer Lifetime Value
  customerLifetimeValue: {
    totalCustomers: 3733,
    avgLifetimeValue: 720000,
    avgTransactionCount: 4.8
  },

  // Attribution Data (for advanced analytics)
  attribution: [
    {
      channel: "meta",
      firstTouchConversions: 150,
      lastTouchConversions: 280,
      multiTouchConversions: 320,
      revenue: 1425000,
      spend: 285000,
      roi: 5.0
    },
    {
      channel: "google",
      firstTouchConversions: 120,
      lastTouchConversions: 200,
      multiTouchConversions: 220,
      revenue: 1125000,
      spend: 125000,
      roi: 9.0
    },
    {
      channel: "organic",
      firstTouchConversions: 80,
      lastTouchConversions: 120,
      multiTouchConversions: 85,
      revenue: 300000,
      spend: 75000,
      roi: 4.0
    }
  ],

  // Customer Metrics (for advanced analytics)
  customerMetrics: {
    cac: 95000,
    ltv: 720000,
    ltv_cac_ratio: 7.58,
    byChannel: [
      { channel: "meta", cac: 285000, ltv: 625000 },
      { channel: "google", cac: 125000, ltv: 750000 },
      { channel: "organic", cac: 68000, ltv: 900000 }
    ]
  },

  // Cohort Retention (for advanced analytics)
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
// 9. ANALYTICS PAGE DATA
// ============================================================================

// Retention Analytics
const dummyRetentionMetrics = {
  overall: {
    day1: 100,
    day7: 87.5,
    day30: 78.5,
    day60: 72.3,
    day90: 68.2
  },
  bySegment: [
    { segment: "Enterprise", day1: 100, day7: 95.2, day30: 89.5, day60: 85.1, day90: 82.3 },
    { segment: "Mid-Market", day1: 100, day7: 88.3, day30: 79.8, day60: 73.5, day90: 69.8 },
    { segment: "SMB", day1: 100, day7: 82.1, day30: 70.2, day60: 63.8, day90: 58.5 }
  ],
  cohortRetention: [
    {
      cohort: "2024-07",
      cohortName: "July 2024",
      size: 245,
      retention: [100, 94, 87, 81, 76, 73, 70],
      revenue: [425000, 380000, 345000, 310000, 285000, 265000, 250000]
    },
    {
      cohort: "2024-08",
      cohortName: "August 2024",
      size: 298,
      retention: [100, 93, 86, 80, 75, 72, 68],
      revenue: [520000, 475000, 430000, 395000, 365000, 340000, 320000]
    },
    {
      cohort: "2024-09",
      cohortName: "September 2024",
      size: 312,
      retention: [100, 92, 85, 79, 74, 71],
      revenue: [580000, 525000, 485000, 445000, 410000, 385000]
    },
    {
      cohort: "2024-10",
      cohortName: "October 2024",
      size: 385,
      retention: [100, 91, 84, 78, 73],
      revenue: [725000, 655000, 605000, 560000, 520000]
    },
    {
      cohort: "2024-11",
      cohortName: "November 2024",
      size: 425,
      retention: [100, 90, 83],
      revenue: [850000, 765000, 705000]
    }
  ],
  churnAnalysis: {
    monthlyChurnRate: 8.2,
    annualizedChurnRate: 62.5,
    churnReasons: [
      { reason: "Price Sensitivity", percentage: 35.2, count: 42 },
      { reason: "Product Fit", percentage: 28.5, count: 34 },
      { reason: "Competitor Switch", percentage: 18.3, count: 22 },
      { reason: "Service Quality", percentage: 12.4, count: 15 },
      { reason: "Other", percentage: 5.6, count: 7 }
    ]
  }
};

// Growth Analytics
const dummyGrowthMetrics = {
  userGrowth: [
    { month: "May 2024", newUsers: 195, totalUsers: 1850, growthRate: 11.8 },
    { month: "Jun 2024", newUsers: 218, totalUsers: 2068, growthRate: 11.8 },
    { month: "Jul 2024", newUsers: 245, totalUsers: 2313, growthRate: 11.8 },
    { month: "Aug 2024", newUsers: 298, totalUsers: 2611, growthRate: 12.9 },
    { month: "Sep 2024", newUsers: 312, totalUsers: 2923, growthRate: 11.9 },
    { month: "Oct 2024", newUsers: 385, totalUsers: 3308, growthRate: 13.2 },
    { month: "Nov 2024", newUsers: 425, totalUsers: 3733, growthRate: 12.8 }
  ],
  revenueGrowth: [
    { month: "May 2024", revenue: 1450000, growth: 8.5, mrr: 485000 },
    { month: "Jun 2024", revenue: 1625000, growth: 12.1, mrr: 542000 },
    { month: "Jul 2024", revenue: 1850000, growth: 13.8, mrr: 617000 },
    { month: "Aug 2024", revenue: 2150000, growth: 16.2, mrr: 717000 },
    { month: "Sep 2024", revenue: 2450000, growth: 14.0, mrr: 817000 },
    { month: "Oct 2024", revenue: 2650000, growth: 8.2, mrr: 883000 },
    { month: "Nov 2024", revenue: 2850000, growth: 7.5, mrr: 950000 }
  ],
  quickRatio: 3.8,
  magicNumber: 1.2,
  growthEfficiency: 0.85
};

// Funnel Analytics
const dummyFunnelAnalysis = {
  overall: {
    visitors: 125000,
    signups: 8750,
    activations: 6125,
    trials: 4375,
    paid: 2625,
    retained: 2100,
    visitorToSignup: 7.0,
    signupToActivation: 70.0,
    activationToTrial: 71.4,
    trialToPaid: 60.0,
    paidToRetained: 80.0,
    overallConversion: 2.1
  },
  byChannel: [
    {
      channel: "Organic Search",
      visitors: 45000,
      signups: 4050,
      paid: 1215,
      conversion: 2.7,
      cac: 42000
    },
    {
      channel: "Paid Search",
      visitors: 35000,
      signups: 2800,
      paid: 840,
      conversion: 2.4,
      cac: 125000
    },
    {
      channel: "Social Media",
      visitors: 28000,
      signups: 1680,
      paid: 420,
      conversion: 1.5,
      cac: 185000
    },
    {
      channel: "Referral",
      visitors: 12000,
      signups: 960,
      paid: 144,
      conversion: 1.2,
      cac: 28000
    },
    {
      channel: "Direct",
      visitors: 5000,
      signups: 260,
      paid: 26,
      conversion: 0.5,
      cac: 95000
    }
  ],
  dropOffPoints: [
    { stage: "Visitor → Signup", dropOff: 93.0, count: 116250 },
    { stage: "Signup → Activation", dropOff: 30.0, count: 2625 },
    { stage: "Activation → Trial", dropOff: 28.6, count: 1750 },
    { stage: "Trial → Paid", dropOff: 40.0, count: 1750 },
    { stage: "Paid → Retained", dropOff: 20.0, count: 525 }
  ]
};

// Segment Analysis
const dummySegmentAnalysis = {
  byCustomerType: [
    {
      segment: "Enterprise",
      customers: 185,
      revenue: 1425000,
      avgRevenue: 7702,
      ltv: 1250000,
      cac: 285000,
      ltvCacRatio: 4.39,
      retention: 89.5,
      churnRate: 4.2
    },
    {
      segment: "Mid-Market",
      customers: 892,
      revenue: 1125000,
      avgRevenue: 1261,
      ltv: 725000,
      cac: 125000,
      ltvCacRatio: 5.80,
      retention: 79.8,
      churnRate: 8.5
    },
    {
      segment: "SMB",
      customers: 2656,
      revenue: 300000,
      avgRevenue: 113,
      ltv: 285000,
      cac: 68000,
      ltvCacRatio: 4.19,
      retention: 70.2,
      churnRate: 12.3
    }
  ],
  byGeography: [
    { region: "North America", customers: 1285, revenue: 1625000, growth: 15.2 },
    { region: "Europe", customers: 985, revenue: 825000, growth: 12.8 },
    { region: "Latin America", customers: 785, revenue: 285000, growth: 22.5 },
    { region: "Asia Pacific", customers: 678, revenue: 115000, growth: 18.7 }
  ],
  byProductTier: [
    { tier: "Enterprise", customers: 185, mrr: 425000, churn: 2.1, expansion: 18.5 },
    { tier: "Professional", customers: 1285, mrr: 425000, churn: 6.8, expansion: 12.2 },
    { tier: "Basic", customers: 2263, mrr: 100000, churn: 14.5, expansion: 4.8 }
  ]
};

// Customer Lifecycle Metrics
const dummyLifecycleMetrics = {
  stages: [
    { stage: "Awareness", count: 125000, percentage: 87.4 },
    { stage: "Consideration", count: 8750, percentage: 6.1 },
    { stage: "Purchase", count: 4375, percentage: 3.1 },
    { stage: "Retention", count: 2625, percentage: 1.8 },
    { stage: "Advocacy", count: 1050, percentage: 0.7 }
  ],
  timeToValue: {
    avgDays: 12,
    bySegment: [
      { segment: "Enterprise", days: 18 },
      { segment: "Mid-Market", days: 12 },
      { segment: "SMB", days: 7 }
    ]
  },
  expansionRevenue: {
    total: 425000,
    rate: 14.9,
    byType: [
      { type: "Upsell", amount: 285000, count: 142 },
      { type: "Cross-sell", amount: 95000, count: 95 },
      { type: "Add-ons", amount: 45000, count: 225 }
    ]
  }
};

// Product Analytics
const dummyProductAnalytics = {
  featureAdoption: [
    { feature: "Dashboard", adoption: 98.5, dau: 3675, mau: 3733 },
    { feature: "Reports", adoption: 82.3, dau: 2980, mau: 3073 },
    { feature: "Integrations", adoption: 68.7, dau: 2265, mau: 2565 },
    { feature: "Advanced Analytics", adoption: 45.2, dau: 1425, mau: 1688 },
    { feature: "API Access", adoption: 28.5, dau: 825, mau: 1064 }
  ],
  engagement: {
    dau: 3675,
    wau: 3710,
    mau: 3733,
    dauMauRatio: 98.4,
    avgSessionDuration: 24,
    avgSessionsPerUser: 8.5
  },
  stickiness: {
    daily: 98.4,
    weekly: 99.4,
    monthly: 100.0
  }
};

// ============================================================================
// 10. DASHBOARD METRICS (for category cards)
// ============================================================================

const dummyDashboardMetrics = {
  // Retention metrics
  retention: {
    retentionRate: 78.5,
    newCustomers: 425,
    averageLTV: 720000,
    churnRate: 8.2,
    repeatPurchaseRate: 42.3
  },

  // Growth metrics
  growth: {
    averageTimeToConversionHours: 18,
    conversionRate: 12.8,
    growthRate: 15.2,
    newUserGrowth: 425,
    revenueGrowthRate: 7.5
  },

  // Data quality metrics
  dataQuality: {
    qualityScore: 94.2,
    connectedSources: 5,
    precision: 92.5,
    completeness: 96.8,
    accuracy: 95.3,
    lastUpdated: "2024-11-10T15:30:00Z"
  },

  // SAC (Customer Service) metrics
  sac: {
    resolutionRate: 87.5,
    averageFirstResponseTimeHours: 2.5,
    averageResolutionTimeHours: 12.3,
    customerSatisfactionScore: 4.6,
    totalCases: 245,
    resolvedCases: 214,
    pendingCases: 31
  }
};

// ============================================================================
// 11. SYNC STATUS DATA
// ============================================================================

const dummySyncStatus = {
  lastSync: "2024-11-10T15:30:00Z",
  nextSync: "2024-11-10T16:30:00Z",
  status: "SYNCED",
  sources: {
    metaAds: {
      status: "SYNCED",
      lastSync: "2024-11-10T15:30:00Z",
      recordsCount: 3
    },
    stripe: {
      status: "SYNCED",
      lastSync: "2024-11-10T15:25:00Z",
      recordsCount: 125
    }
  }
};

// ============================================================================
// 12. DAILY INSIGHTS
// ============================================================================

const dummyDailyInsights = {
  date: "2024-11-10",
  insights: [
    {
      type: "performance",
      title: "Top Performing Campaign",
      message: "Product Launch - Category A has the highest ROAS at 3.71x",
      priority: "info"
    },
    {
      type: "opportunity",
      title: "Budget Optimization",
      message: "Consider reallocating budget from Black Friday Promo (paused) to active campaigns",
      priority: "medium"
    }
  ]
};

// ============================================================================
// EXPORT ALL MOCK DATA
// ============================================================================

export const MOCK_DATA = {
  // Marketing
  marketing: dummyMarketingResponse,
  campaigns: dummyCampaigns,
  dailySpend: dummyDailySpend,

  // Finance
  finance: dummyFinanceResponse,
  transactions: dummyTransactions,

  // Guardrails
  guardrails: dummyGuardrails,

  // Planning
  plans: dummyPlans,
  activePlans: dummyPlans.filter(p => p.status === 'active'),

  // EIO
  alerts: dummyAlerts,
  pendingAlerts: dummyAlerts.filter(a => a.status === 'pending'),
  alertsSummary: dummyAlertsSummary,
  alertsByCategory: dummyAlertsByCategory,
  dailyInsights: dummyDailyInsights,

  // Forecasting
  forecasts: dummyForecasts,
  forecastAccuracyStats: dummyForecastAccuracyStats,

  // KPIs
  kpis: dummyKPIs,

  // Dashboard Metrics (for category cards)
  dashboardMetrics: dummyDashboardMetrics,

  // Cross-Analysis
  crossAnalysis: dummyCrossAnalysisData,

  // Analytics
  retentionMetrics: dummyRetentionMetrics,
  growthMetrics: dummyGrowthMetrics,
  funnelAnalysis: dummyFunnelAnalysis,
  segmentAnalysis: dummySegmentAnalysis,
  lifecycleMetrics: dummyLifecycleMetrics,
  productAnalytics: dummyProductAnalytics,

  // Sync
  syncStatus: dummySyncStatus,
};

export default MOCK_DATA;
